/**
 * Invoice Form Page Component
 * Handles both creating and editing invoices with line items
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input } from '../../components/common';
import { invoiceService } from '../../services/invoice.service';
import { clientService } from '../../services/client.service';
import { useAuthStore } from '../../store/authStore';
import type { Client } from '../../types';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Unit price must be positive'),
});

const invoiceSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const InvoiceFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(id);
  const { user } = useAuthStore();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      items: [{ description: '', quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );
  const taxRate = user?.tax_rate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  useEffect(() => {
    loadClients();
    const preselectedClient = searchParams.get('client');
    if (preselectedClient) {
      setValue('client', preselectedClient);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (isEditMode && id) {
      loadInvoice(id);
    }
  }, [id, isEditMode]);

  const loadClients = async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (err: any) {
      console.error('Failed to load clients:', err);
    }
  };

  const loadInvoice = async (invoiceId: string) => {
    try {
      const invoice = await invoiceService.getInvoice(invoiceId);
      reset({
        client: invoice.client,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        status: invoice.status,
        items: invoice.items.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
        notes: invoice.notes || '',
        terms: invoice.terms || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load invoice');
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    setError(null);
    try {
      if (isEditMode && id) {
        await invoiceService.updateInvoice(id, data);
      } else {
        await invoiceService.createInvoice(data);
      }
      navigate('/invoices');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.items?.[0] ||
        `Failed to ${isEditMode ? 'update' : 'create'} invoice`;
      setError(errorMsg);
    }
  };

  if (isLoadingInvoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-royal-blue hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Invoices
        </button>
        <h1 className="text-3xl font-bold text-deep-navy">
          {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
        </h1>
        <p className="mt-2 text-slate-gray">
          {isEditMode ? 'Update invoice details' : 'Fill in the details for your new invoice'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* API Error */}
        {error && (
          <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-4 py-3 rounded-button">
            {error}
          </div>
        )}

        {/* Invoice Details */}
        <Card>
          <h2 className="text-h5 font-bold text-deep-navy mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-deep-navy mb-2">
                Client <span className="text-error-red">*</span>
              </label>
              <select
                {...register('client')}
                className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.company_name && `(${client.company_name})`}
                  </option>
                ))}
              </select>
              {errors.client && (
                <p className="mt-1 text-body-sm text-error-red">{errors.client.message}</p>
              )}
            </div>

            <div>
              <label className="block text-body-sm font-medium text-deep-navy mb-2">
                Status <span className="text-error-red">*</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-body-sm text-error-red">{errors.status.message}</p>
              )}
            </div>

            <Input
              label="Issue Date"
              type="date"
              error={errors.issue_date?.message}
              {...register('issue_date')}
              required
            />

            <Input
              label="Due Date"
              type="date"
              error={errors.due_date?.message}
              {...register('due_date')}
              required
            />
          </div>
        </Card>

        {/* Line Items */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h5 font-bold text-deep-navy">Line Items</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => append({ description: '', quantity: 1, unit_price: 0 })}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-3 p-4 bg-soft-gray rounded-button"
              >
                <div className="col-span-12 md:col-span-5">
                  <Input
                    label="Description"
                    placeholder="Service or product description"
                    error={errors.items?.[index]?.description?.message}
                    {...register(`items.${index}.description`)}
                    required
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Input
                    label="Quantity"
                    type="number"
                    step="0.01"
                    placeholder="1"
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    required
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    error={errors.items?.[index]?.unit_price?.message}
                    {...register(`items.${index}.unit_price`, {
                      valueAsNumber: true,
                    })}
                    required
                  />
                </div>
                <div className="col-span-10 md:col-span-2 flex items-end">
                  <div className="w-full px-4 py-3 bg-pure-white border border-border-gray rounded-button text-right font-mono font-semibold text-deep-navy">
                    ${((items[index]?.quantity || 0) * (items[index]?.unit_price || 0)).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    fullWidth
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
            {errors.items?.root && (
              <p className="text-body-sm text-error-red">{errors.items.root.message}</p>
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-6 border-t border-border-gray">
            <div className="max-w-sm ml-auto space-y-3">
              <div className="flex justify-between text-body">
                <span className="text-slate-gray">Subtotal:</span>
                <span className="font-mono font-semibold text-deep-navy">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-slate-gray">Tax ({taxRate}%):</span>
                <span className="font-mono font-semibold text-deep-navy">
                  ${taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-h5 pt-3 border-t border-border-gray">
                <span className="font-bold text-deep-navy">Total:</span>
                <span className="font-mono font-bold text-royal-blue">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card>
          <h2 className="text-h5 font-bold text-deep-navy mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-deep-navy mb-2">
                Notes
              </label>
              <textarea
                placeholder="Add any additional notes for the client..."
                rows={3}
                className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent resize-none"
                {...register('notes')}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-deep-navy mb-2">
                Payment Terms
              </label>
              <textarea
                placeholder="Payment terms and conditions..."
                rows={3}
                className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent resize-none"
                {...register('terms')}
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <Card padding="sm">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/invoices')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

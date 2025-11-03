/**
 * Payment Form Page Component
 * Handles recording new payments and editing existing ones
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input } from '../../components/common';
import { paymentService } from '../../services/payment.service';
import { invoiceService } from '../../services/invoice.service';
import type { Invoice } from '../../types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const paymentSchema = z.object({
  invoice: z.string().min(1, 'Invoice is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  payment_date: z.string().min(1, 'Payment date is required'),
  payment_method: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export const PaymentFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(id);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingPayment, setIsLoadingPayment] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'bank_transfer',
    },
  });

  const selectedInvoiceId = watch('invoice');
  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  useEffect(() => {
    loadInvoices();
    const preselectedInvoice = searchParams.get('invoice');
    if (preselectedInvoice) {
      setValue('invoice', preselectedInvoice);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (isEditMode && id) {
      loadPayment(id);
    }
  }, [id, isEditMode]);

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      // Filter to show only invoices that are not fully paid
      const unpaidInvoices = data.filter((inv) => inv.status !== 'paid');
      setInvoices(unpaidInvoices);
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
    }
  };

  const loadPayment = async (paymentId: string) => {
    try {
      const payment = await paymentService.getPayment(paymentId);
      reset({
        invoice: payment.invoice,
        amount: parseFloat(payment.amount),
        payment_date: payment.payment_date,
        payment_method: payment.payment_method || 'bank_transfer',
        reference: payment.reference || '',
        notes: payment.notes || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load payment');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    setError(null);
    try {
      if (isEditMode && id) {
        await paymentService.updatePayment(id, data);
      } else {
        await paymentService.createPayment(data);
      }
      navigate('/payments');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.amount?.[0] ||
        `Failed to ${isEditMode ? 'update' : 'record'} payment`;
      setError(errorMsg);
    }
  };

  if (isLoadingPayment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={() => navigate('/payments')}
          className="flex items-center text-royal-blue hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Payments
        </button>
        <h1 className="text-3xl font-bold text-deep-navy">
          {isEditMode ? 'Edit Payment' : 'Record Payment'}
        </h1>
        <p className="mt-2 text-slate-gray">
          {isEditMode
            ? 'Update payment details'
            : 'Record a payment received from a client'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* API Error */}
          {error && (
            <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-4 py-3 rounded-button">
              {error}
            </div>
          )}

          {/* Payment Details */}
          <div>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium text-deep-navy mb-2">
                  Invoice <span className="text-error-red">*</span>
                </label>
                <select
                  {...register('invoice')}
                  className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                >
                  <option value="">Select an invoice</option>
                  {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {invoice.client__name} - $
                      {parseFloat(invoice.total_amount).toLocaleString()} ({invoice.status})
                    </option>
                  ))}
                </select>
                {errors.invoice && (
                  <p className="mt-1 text-body-sm text-error-red">{errors.invoice.message}</p>
                )}
                {selectedInvoice && (
                  <div className="mt-3 p-4 bg-soft-gray rounded-button">
                    <div className="grid grid-cols-2 gap-3 text-body-sm">
                      <div>
                        <span className="text-slate-gray">Client:</span>
                        <span className="ml-2 font-medium text-deep-navy">
                          {selectedInvoice.client__name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-gray">Total Amount:</span>
                        <span className="ml-2 font-medium font-mono text-deep-navy">
                          ${parseFloat(selectedInvoice.total_amount).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-gray">Status:</span>
                        <span className="ml-2 font-medium text-deep-navy capitalize">
                          {selectedInvoice.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-gray">Due Date:</span>
                        <span className="ml-2 font-medium text-deep-navy">
                          {new Date(selectedInvoice.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={errors.amount?.message}
                  {...register('amount', { valueAsNumber: true })}
                  required
                />

                <Input
                  label="Payment Date"
                  type="date"
                  error={errors.payment_date?.message}
                  {...register('payment_date')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-medium text-deep-navy mb-2">
                    Payment Method
                  </label>
                  <select
                    {...register('payment_method')}
                    className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Input
                  label="Reference Number"
                  placeholder="Transaction ID or reference"
                  error={errors.reference?.message}
                  {...register('reference')}
                />
              </div>

              <div>
                <label className="block text-body-sm font-medium text-deep-navy mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Add any additional notes about this payment..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent resize-none"
                  {...register('notes')}
                />
                {errors.notes && (
                  <p className="mt-1 text-body-sm text-error-red">
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-border-gray">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/payments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? 'Update Payment' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

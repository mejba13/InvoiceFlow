/**
 * Expense Form Page Component
 * Handles creating and editing expenses with receipt upload
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input } from '../../components/common';
import { expenseService } from '../../services/expense.service';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  vendor: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const ExpenseFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [isLoadingExpense, setIsLoadingExpense] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [existingReceipt, setExistingReceipt] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'other',
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadExpense(id);
    }
  }, [id, isEditMode]);

  const loadExpense = async (expenseId: string) => {
    try {
      const expense = await expenseService.getExpense(expenseId);
      reset({
        description: expense.description,
        amount: parseFloat(expense.amount),
        date: expense.date,
        category: expense.category,
        vendor: expense.vendor || '',
        notes: expense.notes || '',
      });
      if (expense.receipt) {
        setExistingReceipt(expense.receipt);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load expense');
    } finally {
      setIsLoadingExpense(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('amount', data.amount.toString());
      formData.append('date', data.date);
      formData.append('category', data.category);
      if (data.vendor) formData.append('vendor', data.vendor);
      if (data.notes) formData.append('notes', data.notes);
      if (receiptFile) formData.append('receipt', receiptFile);

      if (isEditMode && id) {
        await expenseService.updateExpense(id, formData);
      } else {
        await expenseService.createExpense(formData);
      }
      navigate('/expenses');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.amount?.[0] ||
        `Failed to ${isEditMode ? 'update' : 'create'} expense`;
      setError(errorMsg);
    }
  };

  if (isLoadingExpense) {
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
          onClick={() => navigate('/expenses')}
          className="flex items-center text-royal-blue hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Expenses
        </button>
        <h1 className="text-3xl font-bold text-deep-navy">
          {isEditMode ? 'Edit Expense' : 'Add New Expense'}
        </h1>
        <p className="mt-2 text-slate-gray">
          {isEditMode
            ? 'Update expense details'
            : 'Record a new business expense'}
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

          {/* Expense Details */}
          <div>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">Expense Details</h2>
            <div className="space-y-4">
              <Input
                label="Description"
                placeholder="What was this expense for?"
                error={errors.description?.message}
                {...register('description')}
                required
              />

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
                  label="Date"
                  type="date"
                  error={errors.date?.message}
                  {...register('date')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-medium text-deep-navy mb-2">
                    Category <span className="text-error-red">*</span>
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  >
                    <option value="office">Office Supplies</option>
                    <option value="travel">Travel</option>
                    <option value="meals">Meals & Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="software">Software & Subscriptions</option>
                    <option value="marketing">Marketing & Advertising</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-body-sm text-error-red">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Vendor"
                  placeholder="Company or person paid"
                  error={errors.vendor?.message}
                  {...register('vendor')}
                />
              </div>

              <div>
                <label className="block text-body-sm font-medium text-deep-navy mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  rows={3}
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

          {/* Receipt Upload */}
          <div>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">Receipt</h2>
            <div className="space-y-3">
              {existingReceipt && !receiptFile && (
                <div className="p-4 bg-soft-gray rounded-button flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentIcon className="h-6 w-6 text-royal-blue mr-3" />
                    <div>
                      <p className="text-body font-medium text-deep-navy">
                        Current Receipt
                      </p>
                      <a
                        href={existingReceipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-royal-blue hover:underline"
                      >
                        View Receipt
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-body-sm font-medium text-deep-navy mb-2">
                  {existingReceipt ? 'Replace Receipt' : 'Upload Receipt'}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-body-sm file:font-semibold file:bg-royal-blue file:text-pure-white hover:file:bg-opacity-90"
                />
                <p className="mt-1 text-body-sm text-slate-gray">
                  Accepted formats: Images (JPG, PNG) or PDF. Max size: 5MB.
                </p>
              </div>

              {receiptFile && (
                <div className="p-4 bg-success-green bg-opacity-10 border border-success-green rounded-button flex items-center">
                  <DocumentIcon className="h-6 w-6 text-success-green mr-3" />
                  <div>
                    <p className="text-body font-medium text-deep-navy">
                      {receiptFile.name}
                    </p>
                    <p className="text-body-sm text-slate-gray">
                      {(receiptFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-border-gray">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/expenses')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

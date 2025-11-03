/**
 * Client Form Page Component
 * Handles both creating and editing clients
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input } from '../../components/common';
import { clientService } from '../../services/client.service';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export const ClientFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [isLoadingClient, setIsLoadingClient] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadClient(id);
    }
  }, [id, isEditMode]);

  const loadClient = async (clientId: string) => {
    try {
      const client = await clientService.getClient(clientId);
      reset({
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        company_name: client.company_name || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        postal_code: client.postal_code || '',
        country: client.country || '',
        tax_id: client.tax_id || '',
        notes: client.notes || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load client');
    } finally {
      setIsLoadingClient(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    setError(null);
    try {
      if (isEditMode && id) {
        await clientService.updateClient(id, data);
      } else {
        await clientService.createClient(data);
      }
      navigate('/clients');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.name?.[0] ||
        `Failed to ${isEditMode ? 'update' : 'create'} client`;
      setError(errorMsg);
    }
  };

  if (isLoadingClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-royal-blue hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Clients
        </button>
        <h1 className="text-3xl font-bold text-deep-navy">
          {isEditMode ? 'Edit Client' : 'Add New Client'}
        </h1>
        <p className="mt-2 text-slate-gray">
          {isEditMode
            ? 'Update client information'
            : 'Add a new client to your system'}
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

          {/* Basic Information */}
          <div>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
                required
              />
              <Input
                label="Company Name"
                placeholder="Acme Corporation"
                error={errors.company_name?.message}
                {...register('company_name')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">
              Address Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Street Address"
                placeholder="123 Main Street"
                error={errors.address?.message}
                {...register('address')}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  placeholder="New York"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <Input
                  label="State/Province"
                  placeholder="NY"
                  error={errors.state?.message}
                  {...register('state')}
                />
                <Input
                  label="Postal Code"
                  placeholder="10001"
                  error={errors.postal_code?.message}
                  {...register('postal_code')}
                />
              </div>
              <Input
                label="Country"
                placeholder="United States"
                error={errors.country?.message}
                {...register('country')}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Tax ID / VAT Number"
                placeholder="XX-XXXXXXX"
                error={errors.tax_id?.message}
                {...register('tax_id')}
              />
              <div>
                <label className="block text-body-sm font-medium text-deep-navy mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Add any additional notes about this client..."
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
              onClick={() => navigate('/clients')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

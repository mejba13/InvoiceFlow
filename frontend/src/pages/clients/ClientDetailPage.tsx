/**
 * Client Detail Page Component
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, Badge, getInvoiceStatusVariant } from '../../components/common';
import { clientService } from '../../services/client.service';
import type { Client } from '../../types';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export const ClientDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadClient(id);
    }
  }, [id]);

  const loadClient = async (clientId: string) => {
    try {
      const data = await clientService.getClient(clientId);
      setClient(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!client) return;

    if (
      !window.confirm(
        `Are you sure you want to delete client "${client.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await clientService.deleteClient(client.id);
      navigate('/clients');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete client');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-royal-blue hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Clients
        </button>
        <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-6 py-4 rounded-card">
          {error || 'Client not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-royal-blue hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Clients
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-deep-navy">{client.name}</h1>
            {client.company_name && (
              <p className="mt-2 text-xl text-slate-gray">{client.company_name}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to={`/clients/${client.id}/edit`}>
              <Button variant="secondary">
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              {client.email && (
                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-slate-gray mr-3 mt-0.5" />
                  <div>
                    <p className="text-body-sm text-slate-gray">Email</p>
                    <a
                      href={`mailto:${client.email}`}
                      className="text-body text-royal-blue hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>
              )}
              {client.phone && (
                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-slate-gray mr-3 mt-0.5" />
                  <div>
                    <p className="text-body-sm text-slate-gray">Phone</p>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-body text-royal-blue hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                </div>
              )}
              {(client.address || client.city || client.state || client.country) && (
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-slate-gray mr-3 mt-0.5" />
                  <div>
                    <p className="text-body-sm text-slate-gray">Address</p>
                    <div className="text-body text-deep-navy">
                      {client.address && <p>{client.address}</p>}
                      {(client.city || client.state || client.postal_code) && (
                        <p>
                          {client.city}
                          {client.city && client.state && ', '}
                          {client.state} {client.postal_code}
                        </p>
                      )}
                      {client.country && <p>{client.country}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Additional Details */}
          <Card>
            <h2 className="text-h5 font-bold text-deep-navy mb-4">
              Additional Details
            </h2>
            <div className="space-y-3">
              {client.tax_id && (
                <div>
                  <p className="text-body-sm text-slate-gray">Tax ID / VAT</p>
                  <p className="text-body text-deep-navy font-mono">{client.tax_id}</p>
                </div>
              )}
              <div>
                <p className="text-body-sm text-slate-gray">Total Revenue</p>
                <p className="text-h4 font-bold font-mono text-royal-blue">
                  ${parseFloat(client.total_invoiced || '0').toLocaleString()}
                </p>
              </div>
              {client.notes && (
                <div>
                  <p className="text-body-sm text-slate-gray mb-1">Notes</p>
                  <p className="text-body text-deep-navy whitespace-pre-wrap">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Invoices & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card padding="sm">
            <div className="flex gap-3">
              <Link to={`/invoices/new?client=${client.id}`} className="flex-1">
                <Button fullWidth>
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Create Invoice
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h5 font-bold text-deep-navy">Recent Invoices</h2>
              <Link
                to={`/invoices?client=${client.id}`}
                className="text-royal-blue text-body-sm font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>

            {client.invoices && client.invoices.length > 0 ? (
              <div className="space-y-3">
                {client.invoices.slice(0, 5).map((invoice) => (
                  <Link
                    key={invoice.id}
                    to={`/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-4 rounded-button hover:bg-soft-gray transition-colors duration-150 border border-border-gray"
                  >
                    <div className="flex-1">
                      <p className="text-body font-medium text-deep-navy">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-body-sm text-slate-gray">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-body font-semibold font-mono text-deep-navy">
                        ${parseFloat(invoice.total_amount).toLocaleString()}
                      </p>
                      <Badge variant={getInvoiceStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-gray">
                <DocumentTextIcon className="mx-auto h-12 w-12 mb-2" />
                <p className="mb-4">No invoices yet</p>
                <Link to={`/invoices/new?client=${client.id}`}>
                  <Button>
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Create First Invoice
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

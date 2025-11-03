/**
 * Invoices List Page Component
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Badge, getInvoiceStatusVariant } from '../../components/common';
import { invoiceService } from '../../services/invoice.service';
import type { Invoice } from '../../types';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

export const InvoicesListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const clientId = searchParams.get('client');
    fetchInvoices({ client: clientId || undefined });
  }, [searchParams]);

  const fetchInvoices = async (params?: {
    search?: string;
    status?: string;
    client?: string;
  }) => {
    try {
      setIsLoading(true);
      const data = await invoiceService.getInvoices(params);
      setInvoices(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices({
      search: searchTerm,
      status: statusFilter || undefined,
    });
  };

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice "${invoiceNumber}"?`)) {
      return;
    }

    try {
      await invoiceService.deleteInvoice(id);
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete invoice');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-6 py-4 rounded-card">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-navy">Invoices</h1>
          <p className="mt-2 text-slate-gray">
            Manage and track your invoices
          </p>
        </div>
        <Link to="/invoices/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <Card padding="sm">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-gray" />
              <input
                type="text"
                placeholder="Search invoices by number or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-gray" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-10 py-2 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent appearance-none bg-pure-white"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <Button type="submit">Search</Button>
            {(searchTerm || statusFilter) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  fetchInvoices();
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <Card className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-16 w-16 text-slate-gray mb-4" />
          <h3 className="text-h4 font-bold text-deep-navy mb-2">
            {searchTerm || statusFilter ? 'No invoices found' : 'No invoices yet'}
          </h3>
          <p className="text-slate-gray mb-6">
            {searchTerm || statusFilter
              ? 'Try adjusting your search criteria'
              : 'Get started by creating your first invoice'}
          </p>
          {!searchTerm && !statusFilter && (
            <Link to="/invoices/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Invoice
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-gray border-b border-border-gray">
                <tr>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-deep-navy">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-soft-gray transition-colors duration-150 cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-body font-medium font-mono text-royal-blue">
                        {invoice.invoice_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-deep-navy">
                        {invoice.client__name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body font-semibold font-mono text-deep-navy">
                        ${parseFloat(invoice.total_amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getInvoiceStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(invoice.id, invoice.invoice_number)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

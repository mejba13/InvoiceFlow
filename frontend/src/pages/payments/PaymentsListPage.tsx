/**
 * Payments List Page Component
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button } from '../../components/common';
import { paymentService } from '../../services/payment.service';
import type { Payment } from '../../types';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export const PaymentsListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const invoiceId = searchParams.get('invoice');
    fetchPayments({ invoice: invoiceId || undefined });
  }, [searchParams]);

  const fetchPayments = async (params?: {
    search?: string;
    invoice?: string;
  }) => {
    try {
      setIsLoading(true);
      const data = await paymentService.getPayments(params);
      setPayments(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments({ search: searchTerm });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      await paymentService.deletePayment(id);
      setPayments(payments.filter((payment) => payment.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete payment');
    }
  };

  // Calculate total payments
  const totalAmount = payments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount),
    0
  );

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
          <h1 className="text-3xl font-bold text-deep-navy">Payments</h1>
          <p className="mt-2 text-slate-gray">
            Track and manage received payments
          </p>
        </div>
        <Link to="/payments/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Record Payment
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card padding="md">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-card p-3 bg-success-green bg-opacity-10">
            <BanknotesIcon className="h-8 w-8 text-success-green" />
          </div>
          <div className="ml-5">
            <p className="text-body-sm text-slate-gray">Total Payments Received</p>
            <p className="text-h3 font-bold font-mono text-success-green">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Search Bar */}
      <Card padding="sm">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-gray" />
            <input
              type="text"
              placeholder="Search payments by invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
            />
          </div>
          <Button type="submit">Search</Button>
          {searchTerm && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                fetchPayments();
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="text-center py-12">
          <BanknotesIcon className="mx-auto h-16 w-16 text-slate-gray mb-4" />
          <h3 className="text-h4 font-bold text-deep-navy mb-2">
            {searchTerm ? 'No payments found' : 'No payments yet'}
          </h3>
          <p className="text-slate-gray mb-6">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Record your first payment to start tracking'}
          </p>
          {!searchTerm && (
            <Link to="/payments/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Record First Payment
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
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Method
                  </th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-deep-navy">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-soft-gray transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/invoices/${payment.invoice}`}
                        className="text-body font-medium font-mono text-royal-blue hover:underline"
                      >
                        {payment.invoice__invoice_number || payment.invoice}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-deep-navy">
                        {payment.invoice__client__name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body font-semibold font-mono text-success-green">
                        ${parseFloat(payment.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray capitalize">
                        {payment.payment_method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/payments/${payment.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(payment.id)}
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

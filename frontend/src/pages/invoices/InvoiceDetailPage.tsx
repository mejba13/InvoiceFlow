/**
 * Invoice Detail Page Component
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, Button, Badge, getInvoiceStatusVariant } from '../../components/common';
import { invoiceService } from '../../services/invoice.service';
import type { Invoice } from '../../types';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  useEffect(() => {
    if (id) {
      loadInvoice(id);
    }
  }, [id]);

  const loadInvoice = async (invoiceId: string) => {
    try {
      const data = await invoiceService.getInvoice(invoiceId);
      setInvoice(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;

    if (
      !window.confirm(
        `Are you sure you want to delete invoice "${invoice.invoice_number}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await invoiceService.deleteInvoice(invoice.id);
      navigate('/invoices');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete invoice');
    }
  };

  const handleSendEmail = async () => {
    if (!invoice) return;

    try {
      setIsSending(true);
      await invoiceService.sendInvoice(invoice.id);
      alert(`Invoice ${invoice.invoice_number} has been sent successfully!`);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to send invoice');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    try {
      setIsDownloading(true);
      const blob = await invoiceService.downloadInvoice(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to download invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;

    if (!window.confirm(`Mark invoice ${invoice.invoice_number} as paid?`)) {
      return;
    }

    try {
      setIsMarkingPaid(true);
      const updatedInvoice = await invoiceService.markAsPaid(invoice.id);
      setInvoice(updatedInvoice);
      alert('Invoice marked as paid successfully!');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to mark invoice as paid');
    } finally {
      setIsMarkingPaid(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-royal-blue hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Invoices
        </button>
        <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-6 py-4 rounded-card">
          {error || 'Invoice not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-royal-blue hover:underline mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Invoices
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-deep-navy font-mono">
              {invoice.invoice_number}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <Badge variant={getInvoiceStatusVariant(invoice.status)} size="lg">
                {invoice.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/invoices/${invoice.id}/edit`}>
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

      {/* Quick Actions */}
      <Card padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="secondary"
            onClick={handleSendEmail}
            isLoading={isSending}
            fullWidth
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Send Invoice
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
            fullWidth
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download PDF
          </Button>
          {invoice.status !== 'paid' && (
            <Button
              onClick={handleMarkAsPaid}
              isLoading={isMarkingPaid}
              fullWidth
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </Card>

      {/* Invoice Preview */}
      <Card className="print:shadow-none">
        {/* Invoice Header */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border-gray">
          <div>
            <h3 className="text-body-sm font-semibold text-slate-gray mb-2">BILLED TO</h3>
            <p className="text-h5 font-bold text-deep-navy">{invoice.client__name}</p>
            {invoice.client__company_name && (
              <p className="text-body text-slate-gray">{invoice.client__company_name}</p>
            )}
            {invoice.client__email && (
              <p className="text-body text-slate-gray">{invoice.client__email}</p>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-body-sm font-semibold text-slate-gray mb-2">INVOICE DETAILS</h3>
            <div className="space-y-1 text-body">
              <p className="text-slate-gray">
                <span className="font-medium text-deep-navy">Issue Date:</span>{' '}
                {new Date(invoice.issue_date).toLocaleDateString()}
              </p>
              <p className="text-slate-gray">
                <span className="font-medium text-deep-navy">Due Date:</span>{' '}
                {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="border-b-2 border-deep-navy">
              <tr>
                <th className="text-left pb-3 text-body-sm font-bold text-deep-navy">
                  DESCRIPTION
                </th>
                <th className="text-right pb-3 text-body-sm font-bold text-deep-navy w-24">
                  QTY
                </th>
                <th className="text-right pb-3 text-body-sm font-bold text-deep-navy w-32">
                  UNIT PRICE
                </th>
                <th className="text-right pb-3 text-body-sm font-bold text-deep-navy w-32">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 text-body text-deep-navy">{item.description}</td>
                  <td className="py-4 text-right text-body font-mono text-slate-gray">
                    {parseFloat(item.quantity).toFixed(2)}
                  </td>
                  <td className="py-4 text-right text-body font-mono text-slate-gray">
                    ${parseFloat(item.unit_price).toLocaleString()}
                  </td>
                  <td className="py-4 text-right text-body font-mono font-semibold text-deep-navy">
                    ${parseFloat(item.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-body">
              <span className="text-slate-gray">Subtotal:</span>
              <span className="font-mono font-semibold text-deep-navy">
                ${parseFloat(invoice.subtotal).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-slate-gray">Tax:</span>
              <span className="font-mono font-semibold text-deep-navy">
                ${parseFloat(invoice.tax_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-h5 pt-3 border-t-2 border-deep-navy">
              <span className="font-bold text-deep-navy">Total:</span>
              <span className="font-mono font-bold text-royal-blue">
                ${parseFloat(invoice.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="pt-8 border-t border-border-gray space-y-4">
            {invoice.notes && (
              <div>
                <h3 className="text-body-sm font-bold text-deep-navy mb-2">Notes</h3>
                <p className="text-body text-slate-gray whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h3 className="text-body-sm font-bold text-deep-navy mb-2">Payment Terms</h3>
                <p className="text-body text-slate-gray whitespace-pre-wrap">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <Card>
          <h2 className="text-h5 font-bold text-deep-navy mb-4">Payment History</h2>
          <div className="space-y-3">
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-soft-gray rounded-button"
              >
                <div>
                  <p className="text-body font-medium text-deep-navy">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </p>
                  {payment.notes && (
                    <p className="text-body-sm text-slate-gray">{payment.notes}</p>
                  )}
                </div>
                <p className="text-body font-semibold font-mono text-success-green">
                  +${parseFloat(payment.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

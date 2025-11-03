/**
 * Dashboard Page Component
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, getInvoiceStatusVariant } from '../../components/common';
import { dashboardService } from '../../services/dashboard.service';
import type { DashboardData } from '../../types';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-6 py-4 rounded-card">
        {error || 'Failed to load dashboard'}
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Outstanding',
      value: `$${data.overview.total_outstanding.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-info-blue',
      bgColor: 'bg-info-blue bg-opacity-10',
    },
    {
      name: 'Paid This Month',
      value: `$${data.overview.paid_this_month.toLocaleString()}`,
      icon: BanknotesIcon,
      color: 'text-success-green',
      bgColor: 'bg-success-green bg-opacity-10',
    },
    {
      name: 'Pending Invoices',
      value: data.overview.pending_invoices,
      icon: DocumentTextIcon,
      color: 'text-warning-amber',
      bgColor: 'bg-warning-amber bg-opacity-10',
    },
    {
      name: 'Overdue Amount',
      value: `$${data.overview.overdue_amount.toLocaleString()}`,
      icon: ExclamationTriangleIcon,
      color: 'text-error-red',
      bgColor: 'bg-error-red bg-opacity-10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-deep-navy">Dashboard</h1>
        <p className="mt-2 text-slate-gray">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} padding="md" className="animate-slide-up">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-card p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-body-sm font-medium text-slate-gray truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-h4 font-bold text-deep-navy font-mono">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Invoices */}
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h4 font-bold text-deep-navy">Recent Invoices</h2>
            <Link
              to="/invoices"
              className="text-royal-blue text-body-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          {data.recent_invoices.length === 0 ? (
            <div className="text-center py-8 text-slate-gray">
              <DocumentTextIcon className="mx-auto h-12 w-12 mb-2" />
              <p>No invoices yet</p>
              <Link to="/invoices/new" className="text-royal-blue font-semibold hover:underline">
                Create your first invoice
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recent_invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-button hover:bg-soft-gray transition-colors duration-150"
                >
                  <div className="flex-1">
                    <p className="text-body font-medium text-deep-navy">
                      {invoice.invoice_number}
                    </p>
                    <p className="text-body-sm text-slate-gray">{invoice.client__name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-body font-semibold font-mono text-deep-navy">
                      ${parseFloat(invoice.total_amount).toLocaleString()}
                    </p>
                    <Badge variant={getInvoiceStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Clients */}
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h4 font-bold text-deep-navy">Top Clients</h2>
            <Link
              to="/clients"
              className="text-royal-blue text-body-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          {data.top_clients.length === 0 ? (
            <div className="text-center py-8 text-slate-gray">
              <p>No clients yet</p>
              <Link to="/clients/new" className="text-royal-blue font-semibold hover:underline">
                Add your first client
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.top_clients.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-4 rounded-button hover:bg-soft-gray transition-colors duration-150"
                >
                  <div>
                    <p className="text-body font-medium text-deep-navy">{client.name}</p>
                    {client.company_name && (
                      <p className="text-body-sm text-slate-gray">{client.company_name}</p>
                    )}
                  </div>
                  <p className="text-body font-semibold font-mono text-deep-navy">
                    ${client.total_invoiced.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Monthly Revenue Chart Placeholder */}
      {data.monthly_revenue.length > 0 && (
        <Card className="animate-slide-up">
          <h2 className="text-h4 font-bold text-deep-navy mb-6">Revenue Trend</h2>
          <div className="space-y-3">
            {data.monthly_revenue.map((month) => (
              <div key={month.month}>
                <div className="flex justify-between text-body-sm mb-1">
                  <span className="text-slate-gray">{month.month}</span>
                  <span className="font-semibold font-mono text-deep-navy">
                    ${month.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-soft-gray rounded-full h-2">
                  <div
                    className="bg-royal-blue h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((month.revenue / Math.max(...data.monthly_revenue.map(m => m.revenue))) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

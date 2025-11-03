/**
 * Expenses List Page Component
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/common';
import { expenseService } from '../../services/expense.service';
import type { Expense } from '../../types';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ReceiptPercentIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

export const ExpensesListPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async (params?: {
    search?: string;
    category?: string;
  }) => {
    try {
      setIsLoading(true);
      const data = await expenseService.getExpenses(params);
      setExpenses(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExpenses({
      search: searchTerm,
      category: categoryFilter || undefined,
    });
  };

  const handleDelete = async (id: string, description: string) => {
    if (!window.confirm(`Are you sure you want to delete expense "${description}"?`)) {
      return;
    }

    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete expense');
    }
  };

  // Calculate total expenses
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
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
          <h1 className="text-3xl font-bold text-deep-navy">Expenses</h1>
          <p className="mt-2 text-slate-gray">
            Track and manage business expenses
          </p>
        </div>
        <Link to="/expenses/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card padding="md">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-card p-3 bg-error-red bg-opacity-10">
            <ReceiptPercentIcon className="h-8 w-8 text-error-red" />
          </div>
          <div className="ml-5">
            <p className="text-body-sm text-slate-gray">Total Expenses</p>
            <p className="text-h3 font-bold font-mono text-error-red">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Search and Filter Bar */}
      <Card padding="sm">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-gray" />
              <input
                type="text"
                placeholder="Search expenses by description or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-gray" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-10 py-2 border border-border-gray rounded-button focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent appearance-none bg-pure-white"
              >
                <option value="">All Categories</option>
                <option value="office">Office</option>
                <option value="travel">Travel</option>
                <option value="meals">Meals</option>
                <option value="utilities">Utilities</option>
                <option value="software">Software</option>
                <option value="marketing">Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button type="submit">Search</Button>
            {(searchTerm || categoryFilter) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  fetchExpenses();
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <Card className="text-center py-12">
          <ReceiptPercentIcon className="mx-auto h-16 w-16 text-slate-gray mb-4" />
          <h3 className="text-h4 font-bold text-deep-navy mb-2">
            {searchTerm || categoryFilter ? 'No expenses found' : 'No expenses yet'}
          </h3>
          <p className="text-slate-gray mb-6">
            {searchTerm || categoryFilter
              ? 'Try adjusting your search criteria'
              : 'Start tracking your business expenses'}
          </p>
          {!searchTerm && !categoryFilter && (
            <Link to="/expenses/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add First Expense
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
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-body-sm font-semibold text-deep-navy">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-right text-body-sm font-semibold text-deep-navy">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-soft-gray transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body font-medium text-deep-navy">
                        {expense.description}
                      </span>
                      {expense.receipt && (
                        <span className="ml-2 text-body-sm text-royal-blue">
                          (Has receipt)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray capitalize">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body text-slate-gray">
                        {expense.vendor || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body font-semibold font-mono text-error-red">
                        ${parseFloat(expense.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/expenses/${expense.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(expense.id, expense.description)}
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

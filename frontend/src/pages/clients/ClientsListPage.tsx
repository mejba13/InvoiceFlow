/**
 * Clients List Page Component
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/common';
import { clientService } from '../../services/client.service';
import type { Client } from '../../types';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const ClientsListPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async (search?: string) => {
    try {
      setIsLoading(true);
      const data = await clientService.getClients(search);
      setClients(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients(searchTerm);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete client "${name}"?`)) {
      return;
    }

    try {
      await clientService.deleteClient(id);
      setClients(clients.filter((client) => client.id !== id));
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
          <h1 className="text-3xl font-bold text-deep-navy">Clients</h1>
          <p className="mt-2 text-slate-gray">
            Manage your client relationships and track revenue
          </p>
        </div>
        <Link to="/clients/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card padding="sm">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-gray" />
            <input
              type="text"
              placeholder="Search clients by name, email, or company..."
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
                fetchClients();
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {/* Clients List */}
      {clients.length === 0 ? (
        <Card className="text-center py-12">
          <UserGroupIcon className="mx-auto h-16 w-16 text-slate-gray mb-4" />
          <h3 className="text-h4 font-bold text-deep-navy mb-2">
            {searchTerm ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-slate-gray mb-6">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first client'}
          </p>
          {!searchTerm && (
            <Link to="/clients/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Client
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card
              key={client.id}
              padding="md"
              className="animate-slide-up hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-h5 font-bold text-deep-navy mb-1">
                    {client.name}
                  </h3>
                  {client.company_name && (
                    <p className="text-body-sm text-slate-gray mb-2">
                      {client.company_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-body-sm mb-4">
                {client.email && (
                  <p className="text-slate-gray flex items-center">
                    <span className="font-medium text-deep-navy mr-2">Email:</span>
                    {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-slate-gray flex items-center">
                    <span className="font-medium text-deep-navy mr-2">Phone:</span>
                    {client.phone}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border-gray">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-slate-gray">Total Revenue</span>
                  <span className="text-h5 font-bold font-mono text-royal-blue">
                    ${parseFloat(client.total_invoiced || '0').toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clients/${client.id}/edit`);
                  }}
                  fullWidth
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(client.id, client.name);
                  }}
                  fullWidth
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

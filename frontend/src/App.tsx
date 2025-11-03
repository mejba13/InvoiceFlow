/**
 * Main Application Router
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, ProtectedRoute } from './components/layout';
import { LoginPage, RegisterPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { ClientsListPage, ClientFormPage, ClientDetailPage } from './pages/clients';
import { InvoicesListPage, InvoiceFormPage, InvoiceDetailPage } from './pages/invoices';
import { PaymentsListPage, PaymentFormPage } from './pages/payments';
import { ExpensesListPage, ExpenseFormPage } from './pages/expenses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Clients */}
          <Route path="clients">
            <Route index element={<ClientsListPage />} />
            <Route path="new" element={<ClientFormPage />} />
            <Route path=":id" element={<ClientDetailPage />} />
            <Route path=":id/edit" element={<ClientFormPage />} />
          </Route>

          {/* Invoices */}
          <Route path="invoices">
            <Route index element={<InvoicesListPage />} />
            <Route path="new" element={<InvoiceFormPage />} />
            <Route path=":id" element={<InvoiceDetailPage />} />
            <Route path=":id/edit" element={<InvoiceFormPage />} />
          </Route>

          {/* Payments */}
          <Route path="payments">
            <Route index element={<PaymentsListPage />} />
            <Route path="new" element={<PaymentFormPage />} />
            <Route path=":id/edit" element={<PaymentFormPage />} />
          </Route>

          {/* Expenses */}
          <Route path="expenses">
            <Route index element={<ExpensesListPage />} />
            <Route path="new" element={<ExpenseFormPage />} />
            <Route path=":id/edit" element={<ExpenseFormPage />} />
          </Route>

          {/* Reports - Coming Soon */}
          <Route path="reports">
            <Route index element={<div className="p-8 text-center text-slate-gray">Reports page coming soon...</div>} />
          </Route>

          {/* Settings - Coming Soon */}
          <Route path="settings">
            <Route index element={<div className="p-8 text-center text-slate-gray">Settings page coming soon...</div>} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

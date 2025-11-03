/**
 * TypeScript type definitions for InvoiceFlow
 */

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_logo: string | null;
  business_address: string;
  phone: string;
  currency: string;
  tax_rate: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  business_name?: string;
  phone?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  company_name: string;
  address: string;
  phone: string;
  notes: string;
  total_invoiced: number;
  total_paid: number;
  total_outstanding: number;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  company_name?: string;
  address?: string;
  phone?: string;
  notes?: string;
}

// Invoice Types
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount?: number;
  order: number;
}

export interface Invoice {
  id: string;
  client: string;
  client_details: Client;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  notes: string;
  terms: string;
  sent_at: string | null;
  paid_at: string | null;
  items: InvoiceItem[];
  amount_paid: number;
  amount_due: number;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFormData {
  client: string;
  issue_date: string;
  due_date: string;
  status?: InvoiceStatus;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
}

// Payment Types
export type PaymentMethod = 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'CASH' | 'CHECK' | 'OTHER';

export interface Payment {
  id: string;
  invoice: string;
  invoice_number: string;
  client_name: string;
  amount: string;
  payment_date: string;
  payment_method: PaymentMethod;
  transaction_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentFormData {
  invoice: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  transaction_id?: string;
  notes?: string;
}

// Expense Types
export type ExpenseCategory =
  | 'OFFICE_SUPPLIES'
  | 'TRAVEL'
  | 'MEALS'
  | 'SOFTWARE'
  | 'EQUIPMENT'
  | 'MARKETING'
  | 'PROFESSIONAL_SERVICES'
  | 'UTILITIES'
  | 'RENT'
  | 'INSURANCE'
  | 'TAXES'
  | 'OTHER';

export interface Expense {
  id: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  expense_date: string;
  receipt: string | null;
  notes: string;
  vendor: string;
  tax_deductible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFormData {
  description: string;
  amount: number;
  category: ExpenseCategory;
  expense_date: string;
  receipt?: File | null;
  notes?: string;
  vendor?: string;
  tax_deductible?: boolean;
}

// Dashboard Types
export interface DashboardOverview {
  total_outstanding: number;
  paid_this_month: number;
  pending_invoices: number;
  overdue_invoices: number;
  overdue_amount: number;
  expenses_this_month: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RecentInvoice {
  id: string;
  invoice_number: string;
  client__name: string;
  total_amount: string;
  status: InvoiceStatus;
  due_date: string;
}

export interface TopClient {
  name: string;
  company_name: string;
  total_invoiced: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  recent_invoices: RecentInvoice[];
  monthly_revenue: MonthlyRevenue[];
  top_clients: TopClient[];
}

// Report Types
export interface IncomeReport {
  total_income: number;
  invoice_count: number;
  invoices: Array<{
    invoice_number: string;
    client__name: string;
    total_amount: string;
    paid_at: string;
  }>;
}

export interface ExpenseReport {
  total_expenses: number;
  tax_deductible: number;
  by_category: Array<{
    category: ExpenseCategory;
    total: number;
    count: number;
  }>;
  expenses: Array<{
    description: string;
    amount: string;
    category: ExpenseCategory;
    expense_date: string;
    vendor: string;
  }>;
}

export interface ClientReport {
  clients: Array<{
    id: string;
    name: string;
    company_name: string;
    email: string;
    total_invoiced: number;
    total_paid: number;
    invoice_count: number;
  }>;
}

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Error Types
export interface APIError {
  error?: string;
  detail?: string;
  [key: string]: any;
}

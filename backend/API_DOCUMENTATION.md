# InvoiceFlow API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints except registration and login require JWT authentication.

**Header Format:**
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "business_name": "John's Consulting",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "business_name": "John's Consulting",
    "currency": "USD",
    "tax_rate": "0.00"
  },
  "tokens": {
    "refresh": "refresh_token",
    "access": "access_token"
  },
  "message": "User registered successfully"
}
```

---

### Login
**POST** `/api/auth/login/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "refresh": "refresh_token",
  "access": "access_token"
}
```

---

### Refresh Token
**POST** `/api/auth/refresh/`

**Request Body:**
```json
{
  "refresh": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "access": "new_access_token"
}
```

---

### Get User Profile
**GET** `/api/auth/user/`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "business_name": "John's Consulting",
  "business_logo": null,
  "business_address": "",
  "phone": "+1234567890",
  "currency": "USD",
  "tax_rate": "0.00",
  "email_verified": false,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### Update User Profile
**PATCH** `/api/auth/user/`

**Request Body:**
```json
{
  "business_name": "Updated Business Name",
  "tax_rate": "10.00",
  "currency": "EUR"
}
```

---

### Change Password
**POST** `/api/auth/change-password/`

**Request Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!",
  "new_password_confirm": "NewPass123!"
}
```

---

### Logout
**POST** `/api/auth/logout/`

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

---

## Clients Endpoints

### List Clients
**GET** `/api/clients/`

**Query Parameters:**
- `search`: Search by name, email, company_name, phone
- `ordering`: Order by fields (name, created_at, updated_at)
- `page`: Page number for pagination

**Response:** `200 OK`
```json
{
  "count": 10,
  "next": "url_to_next_page",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Client Name",
      "email": "client@example.com",
      "company_name": "Client Company",
      "address": "123 Main St",
      "phone": "+1234567890",
      "notes": "",
      "total_invoiced": 5000.00,
      "total_paid": 3000.00,
      "total_outstanding": 2000.00,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Client
**POST** `/api/clients/`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company_name": "Smith Corp",
  "address": "456 Oak Ave",
  "phone": "+0987654321",
  "notes": "Important client"
}
```

---

### Get Client Details
**GET** `/api/clients/{id}/`

---

### Update Client
**PATCH** `/api/clients/{id}/`

---

### Delete Client
**DELETE** `/api/clients/{id}/`

---

## Invoices Endpoints

### List Invoices
**GET** `/api/invoices/`

**Query Parameters:**
- `status`: Filter by status (DRAFT, SENT, PAID, OVERDUE, CANCELLED)
- `client`: Filter by client ID
- `search`: Search by invoice_number, client name
- `ordering`: Order by fields (issue_date, due_date, total_amount, created_at)

---

### Create Invoice
**POST** `/api/invoices/`

**Request Body:**
```json
{
  "client": "client_uuid",
  "issue_date": "2025-01-01",
  "due_date": "2025-01-31",
  "status": "DRAFT",
  "notes": "Thank you for your business",
  "terms": "Payment due within 30 days",
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 10,
      "unit_price": 100.00,
      "order": 0
    },
    {
      "description": "Design Services",
      "quantity": 5,
      "unit_price": 80.00,
      "order": 1
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "client": "client_uuid",
  "client_details": {...},
  "invoice_number": "INV-2025-00001",
  "issue_date": "2025-01-01",
  "due_date": "2025-01-31",
  "status": "DRAFT",
  "subtotal": "1400.00",
  "tax_amount": "140.00",
  "total_amount": "1540.00",
  "notes": "Thank you for your business",
  "terms": "Payment due within 30 days",
  "items": [...],
  "amount_paid": 0.00,
  "amount_due": 1540.00,
  "is_overdue": false
}
```

---

### Get Invoice Details
**GET** `/api/invoices/{id}/`

---

### Update Invoice
**PATCH** `/api/invoices/{id}/`

---

### Delete Invoice
**DELETE** `/api/invoices/{id}/`

---

### Mark Invoice as Sent
**POST** `/api/invoices/{id}/send/`

---

### Mark Invoice as Paid
**POST** `/api/invoices/{id}/mark_paid/`

---

### Cancel Invoice
**POST** `/api/invoices/{id}/cancel/`

---

### Get Overdue Invoices
**GET** `/api/invoices/overdue/`

---

## Payments Endpoints

### List Payments
**GET** `/api/payments/`

**Query Parameters:**
- `invoice`: Filter by invoice ID
- `payment_method`: Filter by payment method
- `search`: Search by transaction_id, invoice_number

---

### Create Payment
**POST** `/api/payments/`

**Request Body:**
```json
{
  "invoice": "invoice_uuid",
  "amount": 500.00,
  "payment_date": "2025-01-15",
  "payment_method": "BANK_TRANSFER",
  "transaction_id": "TXN123456",
  "notes": "Partial payment received"
}
```

---

### Get Payment Details
**GET** `/api/payments/{id}/`

---

### Update Payment
**PATCH** `/api/payments/{id}/`

---

### Delete Payment
**DELETE** `/api/payments/{id}/`

---

## Expenses Endpoints

### List Expenses
**GET** `/api/expenses/`

**Query Parameters:**
- `category`: Filter by category
- `tax_deductible`: Filter by tax deductible (true/false)
- `search`: Search by description, vendor, notes

---

### Create Expense
**POST** `/api/expenses/`

**Request Body (multipart/form-data for receipt upload):**
```json
{
  "description": "Office Supplies",
  "amount": 250.00,
  "category": "OFFICE_SUPPLIES",
  "expense_date": "2025-01-10",
  "vendor": "Staples",
  "tax_deductible": true,
  "notes": "Monthly office supplies",
  "receipt": "<file>"
}
```

---

### Get Expense Details
**GET** `/api/expenses/{id}/`

---

### Update Expense
**PATCH** `/api/expenses/{id}/`

---

### Delete Expense
**DELETE** `/api/expenses/{id}/`

---

## Reports Endpoints

### Dashboard Statistics
**GET** `/api/reports/dashboard/`

**Response:** `200 OK`
```json
{
  "overview": {
    "total_outstanding": 5000.00,
    "paid_this_month": 3000.00,
    "pending_invoices": 5,
    "overdue_invoices": 2,
    "overdue_amount": 1000.00,
    "expenses_this_month": 800.00
  },
  "recent_invoices": [...],
  "monthly_revenue": [
    {"month": "Aug 2024", "revenue": 2500.00},
    {"month": "Sep 2024", "revenue": 3200.00},
    ...
  ],
  "top_clients": [...]
}
```

---

### Income Report
**GET** `/api/reports/income/`

**Query Parameters:**
- `start_date`: Filter from date (YYYY-MM-DD)
- `end_date`: Filter to date (YYYY-MM-DD)

---

### Expense Report
**GET** `/api/reports/expenses/`

**Query Parameters:**
- `start_date`: Filter from date
- `end_date`: Filter to date

---

### Client Revenue Report
**GET** `/api/reports/clients/`

---

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Resource deleted successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Error Response Format

```json
{
  "error": "Error message",
  "detail": "Detailed error description"
}
```

or for validation errors:

```json
{
  "field_name": ["Error message for this field"],
  "another_field": ["Error message for another field"]
}
```

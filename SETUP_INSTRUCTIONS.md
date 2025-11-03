# InvoiceFlow - Setup Instructions

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (recommended)

---

## Backend Setup (Django)

### 1. Fix npm permissions (if needed)
```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Navigate to backend directory
```bash
cd backend
```

### 3. Create and activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Run migrations
```bash
python manage.py migrate
```

### 6. Create superuser
```bash
python manage.py createsuperuser
```

### 7. Run development server
```bash
python manage.py runserver
```

Backend will be available at: **http://localhost:8000**
Django Admin: **http://localhost:8000/admin**
API Docs: See `backend/API_DOCUMENTATION.md`

---

## Frontend Setup (React + TypeScript + Tailwind)

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

If you encounter permission errors, run:
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

### 3. Run development server
```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## Docker Setup (Recommended for Production)

### 1. Start all services
```bash
docker-compose up --build
```

### 2. Run in detached mode
```bash
docker-compose up -d
```

### 3. View logs
```bash
docker-compose logs -f
```

### 4. Stop services
```bash
docker-compose down
```

### Services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## Project Structure

```
InvoiceFlow/
├── backend/                    # Django REST API
│   ├── invoiceflow/           # Project settings
│   ├── apps/                  # Django applications
│   │   ├── users/            # Authentication & user management
│   │   ├── clients/          # Client management
│   │   ├── invoices/         # Invoice & items
│   │   ├── payments/         # Payment tracking
│   │   ├── expenses/         # Expense tracking
│   │   └── reports/          # Dashboard & analytics
│   ├── requirements.txt
│   ├── Dockerfile
│   └── API_DOCUMENTATION.md   # Complete API reference
│
├── frontend/                   # React TypeScript App
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand state management
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   └── index.css          # Tailwind + Custom styles
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js
│   └── Dockerfile
│
├── docker-compose.yml          # Docker orchestration
├── .env.example                # Environment variables template
└── README.md
```

---

## Environment Variables

### Backend (.env in backend/)
```env
DEBUG=1
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://invoiceflow_user:invoiceflow_password@db:5432/invoiceflow
REDIS_URL=redis://redis:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (.env in frontend/)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## Backend Features Implemented ✅

### Authentication
- ✅ User registration with email verification
- ✅ Login/Logout with JWT tokens
- ✅ Token refresh
- ✅ Password change
- ✅ User profile management

### API Endpoints
- ✅ Clients CRUD (Create, Read, Update, Delete)
- ✅ Invoices CRUD with line items
- ✅ Payments CRUD
- ✅ Expenses CRUD
- ✅ Dashboard statistics
- ✅ Income, Expense, and Client reports

### Database Models
- ✅ Custom User model with business profile
- ✅ Client model
- ✅ Invoice & InvoiceItem models
- ✅ Payment model
- ✅ Expense model
- ✅ All models with UUID primary keys
- ✅ Automatic timestamps and user isolation

### Security & Features
- ✅ JWT authentication with blacklisting
- ✅ Permission-based access
- ✅ CORS configured
- ✅ Input validation
- ✅ Pagination, search, filtering
- ✅ Django Admin configured

---

## Frontend Features Implemented ✅

### Design System
- ✅ Tailwind CSS configured with custom theme
- ✅ Modern Classic design aesthetic
- ✅ Custom color palette (Deep Navy, Royal Blue, etc.)
- ✅ Typography scale (H1-H4, Body, Caption)
- ✅ Spacing system (xs to 4xl)
- ✅ Component styles (buttons, cards, inputs, tables, badges)
- ✅ Custom animations (fade-in, slide-up, scale-in)
- ✅ Responsive utilities

### Dependencies Added
- ✅ React Router v6 (routing)
- ✅ Axios (API calls)
- ✅ Zustand (state management)
- ✅ React Hook Form + Zod (forms & validation)
- ✅ Framer Motion (animations)
- ✅ Recharts (charts & graphs)
- ✅ Heroicons (icons)
- ✅ date-fns (date formatting)

---

## Next Steps - To Be Implemented

### Frontend Components
- [ ] Create reusable Button component
- [ ] Create Card component
- [ ] Create Input component
- [ ] Create Table component
- [ ] Create Badge component
- [ ] Create Modal component

### Pages
- [ ] Login page
- [ ] Register page
- [ ] Dashboard page
- [ ] Clients list/detail pages
- [ ] Invoices list/create/edit pages
- [ ] Payments list/create pages
- [ ] Expenses list/create pages
- [ ] Reports pages
- [ ] User profile page

### State Management
- [ ] Auth store (Zustand)
- [ ] API service configuration
- [ ] Error handling
- [ ] Loading states

### Features
- [ ] Protected routes
- [ ] Form validation
- [ ] Data tables with sorting/filtering
- [ ] Charts and visualizations
- [ ] PDF generation
- [ ] File uploads (receipts, logos)

---

## API Endpoints Reference

### Authentication
```
POST   /api/auth/register/      - Register new user
POST   /api/auth/login/         - Login (get tokens)
POST   /api/auth/refresh/       - Refresh access token
POST   /api/auth/logout/        - Logout (blacklist token)
GET    /api/auth/user/          - Get user profile
PATCH  /api/auth/user/          - Update user profile
POST   /api/auth/change-password/ - Change password
```

### Clients
```
GET    /api/clients/            - List clients
POST   /api/clients/            - Create client
GET    /api/clients/{id}/       - Get client details
PATCH  /api/clients/{id}/       - Update client
DELETE /api/clients/{id}/       - Delete client
```

### Invoices
```
GET    /api/invoices/           - List invoices
POST   /api/invoices/           - Create invoice
GET    /api/invoices/{id}/      - Get invoice details
PATCH  /api/invoices/{id}/      - Update invoice
DELETE /api/invoices/{id}/      - Delete invoice
POST   /api/invoices/{id}/send/ - Mark as sent
POST   /api/invoices/{id}/mark_paid/ - Mark as paid
POST   /api/invoices/{id}/cancel/ - Cancel invoice
GET    /api/invoices/overdue/   - Get overdue invoices
```

### Payments & Expenses
```
GET/POST  /api/payments/        - List/Create payments
GET/POST  /api/expenses/        - List/Create expenses
```

### Reports
```
GET    /api/reports/dashboard/  - Dashboard statistics
GET    /api/reports/income/     - Income report
GET    /api/reports/expenses/   - Expense report
GET    /api/reports/clients/    - Client revenue report
```

---

## Development Workflow

### Backend Development
```bash
# Run server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
pytest

# Access Django shell
python manage.py shell
```

### Frontend Development
```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Troubleshooting

### npm permission errors
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

### PostgreSQL connection issues
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Check credentials

### CORS errors
- Verify CORS_ALLOWED_ORIGINS in backend settings
- Check if frontend URL is whitelisted

### Port already in use
```bash
# Backend (8000)
lsof -ti:8000 | xargs kill -9

# Frontend (5173)
lsof -ti:5173 | xargs kill -9
```

---

## Testing the API

### Using curl
```bash
# Register user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "password_confirm": "Test123!@#",
    "first_name": "John",
    "last_name": "Doe",
    "business_name": "John'\''s Consulting"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

---

## Support

For issues or questions:
1. Check backend/API_DOCUMENTATION.md for API details
2. Review this setup guide
3. Check Django admin for data inspection
4. Review console logs for errors

---

**Project Status**: Backend Complete ✅ | Frontend Setup Complete ✅ | UI Components In Progress ⏳

**Last Updated**: 2025-11-03

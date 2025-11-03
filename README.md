# InvoiceFlow

A modern B2B SaaS application for invoice creation, payment tracking, client management, and financial reporting.

📖 **New to InvoiceFlow?** Check out the [Quick Start Guide](./QUICKSTART.md) to get running in 5 minutes!

## Tech Stack

### Backend
- Django 5.0+
- Django REST Framework
- PostgreSQL 15+
- Redis
- Celery
- JWT Authentication

### Frontend
- React 18+
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router v6
- Framer Motion

## Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd InvoiceFlow
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### 4. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## Quick Setup with Seed Data

For the fastest way to get started with sample data:

### Using Make (Recommended for Unix/Mac)

```bash
# Complete setup: build, start, migrate, and seed
make dev

# Or individual commands
make build      # Build containers
make up         # Start services
make migrate    # Run migrations
make seed       # Add sample data
make seed-clear # Clear and reseed data

# See all available commands
make help
```

### Using Setup Script (Recommended)

**Mac/Linux:**
```bash
./setup.sh
```

**Windows:**
```bash
setup.bat
```

The setup script will guide you through:
1. Fresh installation with sample data
2. Database reset and reseeding
3. Adding seed data only
4. Creating a superuser

### Manual Seeding

```bash
# Run migrations first
docker-compose exec backend python manage.py migrate

# Seed the database with sample data
docker-compose exec backend python manage.py seed_data

# Or clear existing data and reseed
docker-compose exec backend python manage.py seed_data --clear
```

### Demo Users

After seeding, you can log in with these credentials:

| Email | Password | Business Name |
|-------|----------|---------------|
| demo@invoiceflow.com | password123 | InvoiceFlow Demo |
| john@consulting.com | password123 | Smith Consulting |
| sarah@design.studio | password123 | Creative Design Studio |

### Sample Data Included

- **3 Demo Users** with different business profiles
- **5 Clients** per user (Tech Corp, Startup Ventures, etc.)
- **8 Invoices** per user with various statuses (draft, sent, paid, overdue)
- **Realistic Invoice Items** (web design, consulting, etc.)
- **Payments** linked to invoices with different methods
- **10 Expenses** per user across various categories

📖 **For detailed information, see [SEED_DATA.md](./SEED_DATA.md)**

## Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Project Structure

```
InvoiceFlow/
├── backend/
│   ├── invoiceflow/          # Django project settings
│   ├── apps/                 # Django applications
│   │   ├── users/           # User management
│   │   ├── clients/         # Client management
│   │   ├── invoices/        # Invoice management
│   │   ├── payments/        # Payment tracking
│   │   ├── expenses/        # Expense tracking
│   │   └── reports/         # Reports & analytics
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Documentation

API documentation will be available at:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Docker Commands

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Run migrations in container
docker-compose exec backend python manage.py migrate

# Create superuser in container
docker-compose exec backend python manage.py createsuperuser

# Seed database with sample data
docker-compose exec backend python manage.py seed_data

# Seed with clearing existing data
docker-compose exec backend python manage.py seed_data --clear

# Access Django shell
docker-compose exec backend python manage.py shell

# Access PostgreSQL
docker-compose exec db psql -U invoiceflow_user -d invoiceflow
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

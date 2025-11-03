# InvoiceFlow

A modern B2B SaaS application for invoice creation, payment tracking, client management, and financial reporting.

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

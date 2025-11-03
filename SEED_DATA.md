# Seed Data for InvoiceFlow

This document explains how to use the seed data command to populate your database with sample data for development and testing.

## Overview

The seed data command creates:
- **3 Demo Users** with different business profiles
- **5 Clients** per user (15 total)
- **8 Invoices** per user with various statuses (draft, sent, paid, overdue)
- **Invoice Items** with realistic services and pricing
- **Payments** for paid and partially paid invoices
- **10 Expenses** per user with different categories

## Usage

### Basic Seeding

To populate the database with sample data:

```bash
# Using Docker
docker-compose exec backend python manage.py seed_data

# Or if running locally
python manage.py seed_data
```

### Clear and Reseed

To clear existing data and start fresh:

```bash
# Using Docker
docker-compose exec backend python manage.py seed_data --clear

# Or if running locally
python manage.py seed_data --clear
```

**⚠️ Warning**: The `--clear` flag will delete all existing data except superusers!

## Demo Users

After seeding, you can log in with these credentials:

| Email | Password | Business Name |
|-------|----------|---------------|
| demo@invoiceflow.com | password123 | InvoiceFlow Demo |
| john@consulting.com | password123 | Smith Consulting |
| sarah@design.studio | password123 | Creative Design Studio |

## Sample Data Details

### Clients (5 per user)
- Tech Corp - Technology company in San Francisco
- Startup Ventures - Startup in Austin
- Global Industries - Large corporation in New York
- Local Coffee Shop - Small business in Portland
- E-Commerce Solutions - Online business in Seattle

### Invoices (8 per user)
Each user gets invoices with different statuses:
- **Paid**: Invoices from 60-90 days ago, fully paid
- **Sent**: Recent invoices awaiting payment (15-25 days ago)
- **Overdue**: Invoices past due date (45-65 days ago)
- **Draft**: Unsent invoices from today

### Invoice Items
Realistic services with pricing:
- Website Design & Development: $2,500
- Logo Design: $800
- Content Writing: $150/page
- SEO Optimization: $1,200
- Social Media Management: $600/month
- Consulting Hours: $150/hour
- Mobile App Development: $5,000
- Database Setup: $1,000
- Training Sessions: $200/session
- Technical Support: $400/month

### Payments
- Full payments for all "paid" invoices
- Partial payments (50%) for some "sent" invoices
- Various payment methods: bank transfer, credit card, PayPal, check
- Payment references matching invoice numbers

### Expenses (10 per user)
Categories and examples:
- **Software**: Adobe Creative Cloud ($54.99), Google Workspace ($12)
- **Office**: Office supplies ($127.50), Printer ink ($89.99)
- **Meals**: Client lunches ($85), Coffee meetings ($28.50)
- **Travel**: Flights ($450), Hotels ($420)
- **Utilities**: Internet & Phone ($125)
- **Marketing**: LinkedIn Advertising ($200)

## Testing Scenarios

The seed data supports testing various scenarios:

### Dashboard Testing
- View overall metrics with real data
- See revenue trends over time
- Check top clients by revenue
- Review recent invoices

### Invoice Management
- Filter by status (draft, sent, paid, overdue)
- Search by client or invoice number
- Edit draft invoices
- Mark sent invoices as paid
- Generate PDFs for any invoice

### Payment Recording
- Record new payments against existing invoices
- View payment history
- See partial vs. full payments
- Different payment methods

### Expense Tracking
- Filter by category
- View expenses by date range
- Track business spending
- Upload receipts (manual for seeded data)

### Client Management
- View client revenue totals
- See invoice history per client
- Edit client information
- Create new invoices for existing clients

## Database Reset

If you need to completely reset your database:

```bash
# Stop containers
docker-compose down

# Remove database volume
docker volume rm invoiceflow_postgres_data

# Restart and run migrations
docker-compose up -d
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
docker-compose exec backend python manage.py createsuperuser

# Seed data
docker-compose exec backend python manage.py seed_data
```

## Tips for Development

1. **Use `--clear` flag** when you need consistent test data
2. **Create additional superuser** for admin panel access:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```
3. **Test with different users** to ensure data isolation
4. **Modify seed_data.py** to add custom scenarios for your tests
5. **Run seed after migrations** to ensure schema is up to date

## Customization

To customize the seed data, edit:
```
backend/apps/users/management/commands/seed_data.py
```

You can modify:
- Number of users, clients, invoices, etc.
- Sample data values (names, amounts, dates)
- Business logic (payment patterns, invoice statuses)
- Add new data types or scenarios

## Troubleshooting

### Command not found
```bash
# Make sure you're in the backend directory or using docker-compose
cd backend
python manage.py seed_data
```

### Permission errors
```bash
# Ensure Django has database write permissions
docker-compose exec backend python manage.py check
```

### Duplicate data errors
```bash
# Use --clear flag to remove existing data first
docker-compose exec backend python manage.py seed_data --clear
```

### Import errors
```bash
# Ensure all migrations are run
docker-compose exec backend python manage.py migrate
```

## Next Steps

After seeding:
1. Log in to the frontend at http://localhost:3000
2. Explore the dashboard and different modules
3. Test creating, editing, and deleting data
4. Try different user accounts to see data isolation
5. Test the API endpoints at http://localhost:8000/api/

Happy testing! 🚀

# InvoiceFlow Quick Start Guide

Get InvoiceFlow up and running in less than 5 minutes!

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)

## Installation Options

### Option 1: One Command Setup (Easiest) ⚡

**Mac/Linux:**
```bash
make dev
```

**Windows:**
```bash
setup.bat
# Choose option 1: Fresh install
```

That's it! Your application is now running with sample data.

### Option 2: Step by Step

```bash
# 1. Build containers
docker-compose build

# 2. Start services
docker-compose up -d

# 3. Run migrations
docker-compose exec backend python manage.py migrate

# 4. Seed sample data
docker-compose exec backend python manage.py seed_data
```

## Access Your Application

Once setup is complete:

🌐 **Frontend Application**
- URL: http://localhost:3000
- Login with demo credentials below

🔧 **Backend API**
- URL: http://localhost:8000/api/
- Browse available endpoints

👤 **Admin Panel**
- URL: http://localhost:8000/admin/
- Create a superuser to access (see below)

## Demo Credentials

| Email | Password | Business Name |
|-------|----------|---------------|
| demo@invoiceflow.com | password123 | InvoiceFlow Demo |
| john@consulting.com | password123 | Smith Consulting |
| sarah@design.studio | password123 | Creative Design Studio |

## What's Included?

After seeding, you'll have:

✅ **3 demo user accounts** ready to use
✅ **15 clients** (5 per user) with complete contact information
✅ **24 invoices** in various states (paid, sent, overdue, draft)
✅ **Realistic invoice items** (consulting, design, development services)
✅ **Payment records** with multiple payment methods
✅ **30 expense records** across different categories

## Common Commands

### Using Make (Mac/Linux)

```bash
make help           # Show all commands
make up             # Start services
make down           # Stop services
make logs           # View logs
make seed           # Add more sample data
make seed-clear     # Reset and reseed database
make shell          # Django shell
make test           # Run tests
```

### Using Docker Compose Directly

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Create superuser for admin panel
docker-compose exec backend python manage.py createsuperuser

# Access database
docker-compose exec db psql -U invoiceflow_user -d invoiceflow
```

## Testing the Application

### 1. Dashboard
- Log in at http://localhost:3000
- View key metrics: outstanding invoices, payments, revenue trends
- See recent invoices and top clients

### 2. Client Management
- Navigate to "Clients" in the sidebar
- Browse existing clients
- Create new clients
- View client details and invoice history

### 3. Invoice Management
- Navigate to "Invoices"
- Filter by status (Draft, Sent, Paid, Overdue)
- Create new invoices with line items
- View/edit existing invoices
- Try marking an invoice as paid

### 4. Payments
- Navigate to "Payments"
- View payment history
- Record new payments against invoices
- Try different payment methods

### 5. Expenses
- Navigate to "Expenses"
- Browse expenses by category
- Add new expenses
- Upload receipts (images or PDFs)

## Troubleshooting

### "Docker is not running"
**Solution:** Start Docker Desktop and wait for it to fully load

### "Port already in use"
**Solution:** Stop other services using ports 3000, 8000, 5432, or 6379
```bash
# Find what's using a port (Mac/Linux)
lsof -i :3000
lsof -i :8000

# On Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

### "Database connection error"
**Solution:** Wait a few seconds for PostgreSQL to fully start, then try again
```bash
# Check database status
docker-compose ps
```

### "Permission errors on Mac/Linux"
**Solution:** Make scripts executable
```bash
chmod +x setup.sh
chmod +x manage.py
```

### Frontend shows "API connection error"
**Solution:** Ensure backend is running
```bash
# Check if backend is running
docker-compose ps backend

# View backend logs
docker-compose logs backend
```

### Need to start fresh?
**Solution:** Complete reset
```bash
# Option 1: Using Make
make clean
make dev

# Option 2: Using Docker Compose
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

## Next Steps

1. **Explore the UI**: Navigate through all modules to see the features
2. **Create custom data**: Add your own clients and invoices
3. **Try the API**: Visit http://localhost:8000/api/ to explore endpoints
4. **Read the docs**: Check out [SEED_DATA.md](./SEED_DATA.md) for more details
5. **Customize**: Modify the seed data in `backend/apps/users/management/commands/seed_data.py`

## Need Help?

- 📚 Full documentation: [README.md](./README.md)
- 🌱 Seed data details: [SEED_DATA.md](./SEED_DATA.md)
- 🐛 Issues: Create an issue on GitHub
- 💬 Questions: Check the docs or reach out to the team

---

**Happy Coding! 🚀**

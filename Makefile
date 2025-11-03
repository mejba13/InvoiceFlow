.PHONY: help build up down restart logs shell migrate createsuperuser seed seed-clear test clean

help:
	@echo "InvoiceFlow Development Commands"
	@echo "================================"
	@echo "make build          - Build Docker containers"
	@echo "make up             - Start all services"
	@echo "make down           - Stop all services"
	@echo "make restart        - Restart all services"
	@echo "make logs           - View container logs"
	@echo "make shell          - Access Django shell"
	@echo "make migrate        - Run database migrations"
	@echo "make createsuperuser - Create a superuser"
	@echo "make seed           - Seed database with sample data"
	@echo "make seed-clear     - Clear and reseed database"
	@echo "make test           - Run backend tests"
	@echo "make clean          - Remove containers and volumes"

build:
	@echo "Building Docker containers..."
	docker-compose build

up:
	@echo "Starting services..."
	docker-compose up -d
	@echo "✓ Services started"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend API: http://localhost:8000/api"
	@echo "  Admin: http://localhost:8000/admin"

down:
	@echo "Stopping services..."
	docker-compose down
	@echo "✓ Services stopped"

restart: down up
	@echo "✓ Services restarted"

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend python manage.py shell

migrate:
	@echo "Running migrations..."
	docker-compose exec backend python manage.py migrate
	@echo "✓ Migrations complete"

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

seed:
	@echo "Seeding database with sample data..."
	docker-compose exec backend python manage.py seed_data
	@echo ""
	@echo "✓ Seeding complete!"
	@echo ""
	@echo "Demo Users:"
	@echo "  - demo@invoiceflow.com (password: password123)"
	@echo "  - john@consulting.com (password: password123)"
	@echo "  - sarah@design.studio (password: password123)"

seed-clear:
	@echo "Clearing and reseeding database..."
	docker-compose exec backend python manage.py seed_data --clear
	@echo ""
	@echo "✓ Database reseeded!"
	@echo ""
	@echo "Demo Users:"
	@echo "  - demo@invoiceflow.com (password: password123)"
	@echo "  - john@consulting.com (password: password123)"
	@echo "  - sarah@design.studio (password: password123)"

test:
	@echo "Running backend tests..."
	docker-compose exec backend pytest

clean:
	@echo "Removing containers and volumes..."
	docker-compose down -v
	@echo "✓ Cleanup complete"

# Frontend specific commands
frontend-shell:
	docker-compose exec frontend sh

frontend-install:
	docker-compose exec frontend npm install

frontend-build:
	docker-compose exec frontend npm run build

# Database commands
db-shell:
	docker-compose exec db psql -U invoiceflow_user -d invoiceflow

db-backup:
	@echo "Creating database backup..."
	docker-compose exec db pg_dump -U invoiceflow_user invoiceflow > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✓ Backup created"

# Development commands
dev: build up migrate seed
	@echo ""
	@echo "✓ Development environment ready!"
	@echo ""
	@echo "Demo Users:"
	@echo "  - demo@invoiceflow.com (password: password123)"
	@echo "  - john@consulting.com (password: password123)"
	@echo "  - sarah@design.studio (password: password123)"
	@echo ""
	@echo "Access the application:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend API: http://localhost:8000/api"
	@echo "  - Admin Panel: http://localhost:8000/admin"

reset: clean
	@echo "Resetting development environment..."
	$(MAKE) dev
	@echo "✓ Environment reset complete!"

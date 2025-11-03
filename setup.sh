#!/bin/bash

# InvoiceFlow Quick Setup Script
# This script helps you quickly set up and seed the InvoiceFlow application

set -e  # Exit on error

echo "=========================================="
echo "   InvoiceFlow Quick Setup"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed."
    exit 1
fi

echo "✓ docker-compose is available"
echo ""

# Function to wait for database
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    sleep 5
    docker-compose exec -T backend python manage.py check --database default > /dev/null 2>&1
    while [ $? -ne 0 ]; do
        sleep 2
        docker-compose exec -T backend python manage.py check --database default > /dev/null 2>&1
    done
    echo "✓ Database is ready"
}

# Ask user what they want to do
echo "What would you like to do?"
echo ""
echo "1) Fresh install (build, migrate, seed data)"
echo "2) Reset database and reseed data"
echo "3) Just seed data (keep existing data)"
echo "4) Create superuser"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting fresh installation..."
        echo ""

        # Build and start containers
        echo "📦 Building Docker containers..."
        docker-compose build

        echo ""
        echo "🚀 Starting containers..."
        docker-compose up -d

        # Wait for database
        wait_for_db

        echo ""
        echo "🔄 Running migrations..."
        docker-compose exec backend python manage.py migrate

        echo ""
        echo "🌱 Seeding database with sample data..."
        docker-compose exec backend python manage.py seed_data

        echo ""
        echo "✅ Setup complete!"
        echo ""
        echo "Demo Users:"
        echo "  - demo@invoiceflow.com (password: password123)"
        echo "  - john@consulting.com (password: password123)"
        echo "  - sarah@design.studio (password: password123)"
        echo ""
        echo "Access the application:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:8000/api"
        echo "  - Admin Panel: http://localhost:8000/admin"
        ;;

    2)
        echo ""
        echo "🗑️  Resetting database..."

        # Stop containers
        docker-compose down

        # Remove database volume
        echo "📦 Removing database volume..."
        docker volume rm invoiceflow_postgres_data 2>/dev/null || true

        # Start containers
        echo "🚀 Starting containers..."
        docker-compose up -d

        # Wait for database
        wait_for_db

        echo ""
        echo "🔄 Running migrations..."
        docker-compose exec backend python manage.py migrate

        echo ""
        echo "🌱 Seeding database with sample data..."
        docker-compose exec backend python manage.py seed_data

        echo ""
        echo "✅ Database reset complete!"
        echo ""
        echo "Demo Users:"
        echo "  - demo@invoiceflow.com (password: password123)"
        echo "  - john@consulting.com (password: password123)"
        echo "  - sarah@design.studio (password: password123)"
        ;;

    3)
        echo ""
        echo "🌱 Seeding database..."
        docker-compose exec backend python manage.py seed_data

        echo ""
        echo "✅ Seeding complete!"
        ;;

    4)
        echo ""
        echo "👤 Creating superuser..."
        docker-compose exec backend python manage.py createsuperuser

        echo ""
        echo "✅ Superuser created!"
        ;;

    5)
        echo "Goodbye! 👋"
        exit 0
        ;;

    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "Need help? Check out:"
echo "  - README.md for general information"
echo "  - SEED_DATA.md for seed data details"
echo "=========================================="

"""
Management command to seed the database with sample data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from apps.users.models import User
from apps.clients.models import Client
from apps.invoices.models import Invoice, InvoiceItem
from apps.payments.models import Payment
from apps.expenses.models import Expense


class Command(BaseCommand):
    help = 'Seeds the database with sample data for development and testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Expense.objects.all().delete()
            Payment.objects.all().delete()
            InvoiceItem.objects.all().delete()
            Invoice.objects.all().delete()
            Client.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS(' Cleared existing data'))

        # Create demo users
        self.stdout.write('Creating users...')
        users = self.create_users()
        self.stdout.write(self.style.SUCCESS(f' Created {len(users)} users'))

        # Create clients for each user
        self.stdout.write('Creating clients...')
        clients_count = 0
        for user in users:
            clients = self.create_clients(user)
            clients_count += len(clients)

            # Create invoices
            self.stdout.write(f'Creating invoices for {user.email}...')
            invoices = self.create_invoices(user, clients)
            self.stdout.write(self.style.SUCCESS(f' Created {len(invoices)} invoices'))

            # Create payments
            self.stdout.write(f'Creating payments for {user.email}...')
            payments = self.create_payments(invoices)
            self.stdout.write(self.style.SUCCESS(f' Created {len(payments)} payments'))

            # Create expenses
            self.stdout.write(f'Creating expenses for {user.email}...')
            expenses = self.create_expenses(user)
            self.stdout.write(self.style.SUCCESS(f' Created {len(expenses)} expenses'))

        self.stdout.write(self.style.SUCCESS(f'\n Created {clients_count} clients total'))
        self.stdout.write(self.style.SUCCESS('\n=== Seeding Complete ==='))
        self.stdout.write('\nDemo Users:')
        for user in users:
            self.stdout.write(f'  Email: {user.email} | Password: password123')

    def create_users(self):
        """Create demo users"""
        users_data = [
            {
                'email': 'demo@invoiceflow.com',
                'first_name': 'Demo',
                'last_name': 'User',
                'business_name': 'InvoiceFlow Demo',
                'phone': '+1 (555) 123-4567',
                'tax_rate': Decimal('10.00'),
            },
            {
                'email': 'john@consulting.com',
                'first_name': 'John',
                'last_name': 'Smith',
                'business_name': 'Smith Consulting',
                'phone': '+1 (555) 234-5678',
                'tax_rate': Decimal('8.50'),
            },
            {
                'email': 'sarah@design.studio',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'business_name': 'Creative Design Studio',
                'phone': '+1 (555) 345-6789',
                'tax_rate': Decimal('9.00'),
            },
        ]

        users = []
        for data in users_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'business_name': data['business_name'],
                    'phone': data['phone'],
                    'tax_rate': data['tax_rate'],
                    'is_active': True,
                    'email_verified': True,
                }
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)

        return users

    def create_clients(self, user):
        """Create sample clients for a user"""
        clients_data = [
            {
                'name': 'Tech Corp',
                'email': 'contact@techcorp.com',
                'phone': '+1 (555) 111-2222',
                'company_name': 'Tech Corporation Inc.',
                'address': '123 Tech Street\nSan Francisco, CA 94105\nUnited States',
                'notes': 'Tax ID: TC-123456',
            },
            {
                'name': 'Startup Ventures',
                'email': 'hello@startupventures.io',
                'phone': '+1 (555) 222-3333',
                'company_name': 'Startup Ventures LLC',
                'address': '456 Innovation Ave\nAustin, TX 78701\nUnited States',
                'notes': 'Tax ID: SV-789012',
            },
            {
                'name': 'Global Industries',
                'email': 'info@globalindustries.com',
                'phone': '+1 (555) 333-4444',
                'company_name': 'Global Industries Group',
                'address': '789 Business Blvd\nNew York, NY 10001\nUnited States',
                'notes': 'Tax ID: GI-345678',
            },
            {
                'name': 'Local Coffee Shop',
                'email': 'owner@localcoffee.com',
                'phone': '+1 (555) 444-5555',
                'company_name': 'Local Coffee Shop',
                'address': '321 Main Street\nPortland, OR 97201\nUnited States',
            },
            {
                'name': 'E-Commerce Solutions',
                'email': 'support@ecommercesolutions.com',
                'phone': '+1 (555) 555-6666',
                'company_name': 'E-Commerce Solutions Inc.',
                'address': '654 Digital Lane\nSeattle, WA 98101\nUnited States',
                'notes': 'Tax ID: EC-901234',
            },
        ]

        clients = []
        for data in clients_data:
            client, _ = Client.objects.get_or_create(
                user=user,
                email=data['email'],
                defaults=data
            )
            clients.append(client)

        return clients

    def create_invoices(self, user, clients):
        """Create sample invoices with various statuses"""
        invoices = []
        statuses = ['paid', 'sent', 'overdue', 'draft']

        for i, client in enumerate(clients[:4]):  # Create invoices for first 4 clients
            for j in range(2):  # 2 invoices per client
                status = statuses[(i + j) % len(statuses)]

                # Calculate dates based on status
                if status == 'paid':
                    issue_date = timezone.now().date() - timedelta(days=60 + j*15)
                    due_date = issue_date + timedelta(days=30)
                elif status == 'sent':
                    issue_date = timezone.now().date() - timedelta(days=15 + j*5)
                    due_date = issue_date + timedelta(days=30)
                elif status == 'overdue':
                    issue_date = timezone.now().date() - timedelta(days=45 + j*10)
                    due_date = issue_date + timedelta(days=15)
                else:  # draft
                    issue_date = timezone.now().date()
                    due_date = issue_date + timedelta(days=30)

                invoice = Invoice.objects.create(
                    user=user,
                    client=client,
                    issue_date=issue_date,
                    due_date=due_date,
                    status=status,
                    notes='Thank you for your business!' if status != 'draft' else '',
                    terms='Payment due within 30 days. Late payments may incur fees.',
                )

                # Create invoice items
                self.create_invoice_items(invoice, j + 2)  # 2-3 items per invoice
                invoices.append(invoice)

        return invoices

    def create_invoice_items(self, invoice, num_items):
        """Create sample invoice items"""
        items_templates = [
            {'description': 'Website Design & Development', 'quantity': 1, 'unit_price': Decimal('2500.00')},
            {'description': 'Logo Design', 'quantity': 1, 'unit_price': Decimal('800.00')},
            {'description': 'Content Writing (per page)', 'quantity': 5, 'unit_price': Decimal('150.00')},
            {'description': 'SEO Optimization', 'quantity': 1, 'unit_price': Decimal('1200.00')},
            {'description': 'Social Media Management (monthly)', 'quantity': 1, 'unit_price': Decimal('600.00')},
            {'description': 'Consulting Hours', 'quantity': 10, 'unit_price': Decimal('150.00')},
            {'description': 'Mobile App Development', 'quantity': 1, 'unit_price': Decimal('5000.00')},
            {'description': 'Database Setup & Configuration', 'quantity': 1, 'unit_price': Decimal('1000.00')},
            {'description': 'Training Session', 'quantity': 3, 'unit_price': Decimal('200.00')},
            {'description': 'Technical Support (monthly)', 'quantity': 1, 'unit_price': Decimal('400.00')},
        ]

        import random
        selected_items = random.sample(items_templates, min(num_items, len(items_templates)))

        for item_data in selected_items:
            InvoiceItem.objects.create(
                invoice=invoice,
                **item_data
            )

    def create_payments(self, invoices):
        """Create sample payments for paid invoices"""
        payments = []
        payment_methods = ['BANK_TRANSFER', 'CREDIT_CARD', 'PAYPAL', 'CHECK']

        for invoice in invoices:
            if invoice.status == 'paid':
                # Full payment
                payment = Payment.objects.create(
                    invoice=invoice,
                    amount=invoice.total_amount,
                    payment_date=invoice.issue_date + timedelta(days=20),
                    payment_method=payment_methods[len(payments) % len(payment_methods)],
                    transaction_id=f'PAY-{invoice.invoice_number}',
                    notes='Payment received in full',
                )
                payments.append(payment)
            elif invoice.status == 'sent':
                # Partial payment for some sent invoices
                import random
                if random.choice([True, False]):
                    payment = Payment.objects.create(
                        invoice=invoice,
                        amount=invoice.total_amount / 2,
                        payment_date=invoice.issue_date + timedelta(days=10),
                        payment_method=payment_methods[len(payments) % len(payment_methods)],
                        transaction_id=f'PAY-{invoice.invoice_number}-PARTIAL',
                        notes='Partial payment received',
                    )
                    payments.append(payment)

        return payments

    def create_expenses(self, user):
        """Create sample expenses"""
        expenses_data = [
            {
                'description': 'Adobe Creative Cloud Subscription',
                'amount': Decimal('54.99'),
                'category': 'SOFTWARE',
                'vendor': 'Adobe Inc.',
                'expense_date': timezone.now().date() - timedelta(days=5),
            },
            {
                'description': 'Office Supplies',
                'amount': Decimal('127.50'),
                'category': 'OFFICE_SUPPLIES',
                'vendor': 'Office Depot',
                'expense_date': timezone.now().date() - timedelta(days=10),
            },
            {
                'description': 'Client Lunch Meeting',
                'amount': Decimal('85.00'),
                'category': 'MEALS',
                'vendor': 'Italian Restaurant',
                'expense_date': timezone.now().date() - timedelta(days=7),
            },
            {
                'description': 'Flight to Conference',
                'amount': Decimal('450.00'),
                'category': 'TRAVEL',
                'vendor': 'United Airlines',
                'expense_date': timezone.now().date() - timedelta(days=15),
            },
            {
                'description': 'Hotel Stay (3 nights)',
                'amount': Decimal('420.00'),
                'category': 'TRAVEL',
                'vendor': 'Hilton Hotels',
                'expense_date': timezone.now().date() - timedelta(days=14),
            },
            {
                'description': 'Internet & Phone Service',
                'amount': Decimal('125.00'),
                'category': 'UTILITIES',
                'vendor': 'Comcast',
                'expense_date': timezone.now().date() - timedelta(days=3),
            },
            {
                'description': 'Google Workspace',
                'amount': Decimal('12.00'),
                'category': 'SOFTWARE',
                'vendor': 'Google LLC',
                'expense_date': timezone.now().date() - timedelta(days=2),
            },
            {
                'description': 'LinkedIn Advertising',
                'amount': Decimal('200.00'),
                'category': 'MARKETING',
                'vendor': 'LinkedIn Corporation',
                'expense_date': timezone.now().date() - timedelta(days=8),
            },
            {
                'description': 'Printer Ink Cartridges',
                'amount': Decimal('89.99'),
                'category': 'OFFICE_SUPPLIES',
                'vendor': 'Amazon',
                'expense_date': timezone.now().date() - timedelta(days=12),
            },
            {
                'description': 'Coffee with Potential Client',
                'amount': Decimal('28.50'),
                'category': 'MEALS',
                'vendor': 'Starbucks',
                'expense_date': timezone.now().date() - timedelta(days=4),
            },
        ]

        expenses = []
        for data in expenses_data:
            expense = Expense.objects.create(
                user=user,
                **data
            )
            expenses.append(expense)

        return expenses

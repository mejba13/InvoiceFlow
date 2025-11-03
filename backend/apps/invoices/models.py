"""
Invoice models for InvoiceFlow
"""

import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal


class Invoice(models.Model):
    """Invoice model"""

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('CANCELLED', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    client = models.ForeignKey('clients.Client', on_delete=models.PROTECT, related_name='invoices')

    # Invoice details
    invoice_number = models.CharField(max_length=50, unique=True)
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Amounts
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    # Additional info
    notes = models.TextField(blank=True, help_text='Private notes (not shown to client)')
    terms = models.TextField(blank=True, help_text='Payment terms and conditions')

    # Status tracking
    sent_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['client', '-created_at']),
            models.Index(fields=['invoice_number']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.client.name}"

    def save(self, *args, **kwargs):
        """Override save to auto-generate invoice number and calculate totals"""
        if not self.invoice_number:
            self.invoice_number = self.generate_invoice_number()

        # Auto-update status based on dates and payment
        self.update_status()

        super().save(*args, **kwargs)

    def generate_invoice_number(self):
        """Generate unique invoice number"""
        year = timezone.now().year
        last_invoice = Invoice.objects.filter(
            user=self.user,
            invoice_number__startswith=f'INV-{year}-'
        ).order_by('-invoice_number').first()

        if last_invoice:
            last_number = int(last_invoice.invoice_number.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1

        return f'INV-{year}-{new_number:05d}'

    def calculate_totals(self):
        """Calculate subtotal, tax, and total amounts"""
        items = self.items.all()
        self.subtotal = sum(item.amount for item in items)

        # Calculate tax based on user's tax rate
        tax_rate = self.user.tax_rate / Decimal('100')
        self.tax_amount = self.subtotal * tax_rate

        self.total_amount = self.subtotal + self.tax_amount

        self.save(update_fields=['subtotal', 'tax_amount', 'total_amount', 'updated_at'])

    def update_status(self):
        """Update invoice status based on dates and payments"""
        if self.status == 'CANCELLED':
            return

        if self.paid_at:
            self.status = 'PAID'
        elif self.sent_at and self.due_date < timezone.now().date() and self.status not in ['PAID', 'CANCELLED']:
            self.status = 'OVERDUE'
        elif self.sent_at:
            self.status = 'SENT'

    def mark_as_sent(self):
        """Mark invoice as sent"""
        if not self.sent_at:
            self.sent_at = timezone.now()
            self.status = 'SENT'
            self.save(update_fields=['sent_at', 'status', 'updated_at'])

    def mark_as_paid(self):
        """Mark invoice as paid"""
        if not self.paid_at:
            self.paid_at = timezone.now()
            self.status = 'PAID'
            self.save(update_fields=['paid_at', 'status', 'updated_at'])

    def get_amount_paid(self):
        """Calculate total amount paid for this invoice"""
        return self.payments.aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0.00')

    def get_amount_due(self):
        """Calculate remaining amount due"""
        return self.total_amount - self.get_amount_paid()

    def is_overdue(self):
        """Check if invoice is overdue"""
        return (
            self.status not in ['PAID', 'CANCELLED'] and
            self.due_date < timezone.now().date()
        )


class InvoiceItem(models.Model):
    """Invoice line item model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')

    # Item details
    description = models.CharField(max_length=500)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1.00)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    # For sorting items
    order = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Invoice Item'
        verbose_name_plural = 'Invoice Items'
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['invoice', 'order']),
        ]

    def __str__(self):
        return f"{self.description} - {self.invoice.invoice_number}"

    def save(self, *args, **kwargs):
        """Override save to calculate amount"""
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)

        # Update invoice totals
        self.invoice.calculate_totals()

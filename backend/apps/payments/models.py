"""
Payment models for InvoiceFlow
"""

import uuid
from django.db import models
from django.conf import settings


class Payment(models.Model):
    """Payment model"""

    PAYMENT_METHOD_CHOICES = [
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CREDIT_CARD', 'Credit Card'),
        ('DEBIT_CARD', 'Debit Card'),
        ('PAYPAL', 'PayPal'),
        ('CASH', 'Cash'),
        ('CHECK', 'Check'),
        ('OTHER', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey('invoices.Invoice', on_delete=models.CASCADE, related_name='payments')

    # Payment details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='BANK_TRANSFER')
    notes = models.TextField(blank=True)

    # Reference information
    transaction_id = models.CharField(max_length=255, blank=True, help_text='External transaction reference')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-payment_date', '-created_at']
        indexes = [
            models.Index(fields=['invoice', '-payment_date']),
            models.Index(fields=['-payment_date']),
        ]

    def __str__(self):
        return f"Payment {self.amount} for {self.invoice.invoice_number}"

    def save(self, *args, **kwargs):
        """Override save to update invoice status"""
        super().save(*args, **kwargs)

        # Check if invoice is fully paid
        if self.invoice.get_amount_paid() >= self.invoice.total_amount:
            self.invoice.mark_as_paid()

"""
Expense models for InvoiceFlow
"""

import uuid
from django.db import models
from django.conf import settings


class Expense(models.Model):
    """Expense model"""

    CATEGORY_CHOICES = [
        ('OFFICE_SUPPLIES', 'Office Supplies'),
        ('TRAVEL', 'Travel'),
        ('MEALS', 'Meals & Entertainment'),
        ('SOFTWARE', 'Software & Subscriptions'),
        ('EQUIPMENT', 'Equipment'),
        ('MARKETING', 'Marketing & Advertising'),
        ('PROFESSIONAL_SERVICES', 'Professional Services'),
        ('UTILITIES', 'Utilities'),
        ('RENT', 'Rent'),
        ('INSURANCE', 'Insurance'),
        ('TAXES', 'Taxes'),
        ('OTHER', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')

    # Expense details
    description = models.CharField(max_length=500)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    expense_date = models.DateField()

    # Receipt
    receipt = models.ImageField(upload_to='receipts/', null=True, blank=True)

    # Additional info
    notes = models.TextField(blank=True)
    vendor = models.CharField(max_length=255, blank=True, help_text='Vendor or payee name')

    # Tax deductible
    tax_deductible = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
        ordering = ['-expense_date', '-created_at']
        indexes = [
            models.Index(fields=['user', '-expense_date']),
            models.Index(fields=['user', 'category']),
            models.Index(fields=['-expense_date']),
        ]

    def __str__(self):
        return f"{self.description} - {self.amount}"

"""
Client models for InvoiceFlow
"""

import uuid
from django.db import models
from django.conf import settings


class Client(models.Model):
    """Client model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clients')

    # Client information
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    company_name = models.CharField(max_length=255, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
        ordering = ['-created_at']
        unique_together = [['user', 'email']]
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'email']),
        ]

    def __str__(self):
        return f"{self.name} ({self.company_name})" if self.company_name else self.name

    def get_total_invoiced(self):
        """Calculate total amount invoiced to this client"""
        return self.invoices.aggregate(
            total=models.Sum('total_amount')
        )['total'] or 0

    def get_total_paid(self):
        """Calculate total amount paid by this client"""
        return self.invoices.filter(
            status='PAID'
        ).aggregate(
            total=models.Sum('total_amount')
        )['total'] or 0

    def get_total_outstanding(self):
        """Calculate total outstanding amount from this client"""
        return self.invoices.exclude(
            status__in=['PAID', 'CANCELLED']
        ).aggregate(
            total=models.Sum('total_amount')
        )['total'] or 0

"""
Admin configuration for Payment model
"""

from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin for Payment model"""

    list_display = ['invoice', 'amount', 'payment_date', 'payment_method', 'created_at']
    list_filter = ['payment_method', 'payment_date', 'created_at']
    search_fields = ['invoice__invoice_number', 'transaction_id', 'notes']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-payment_date', '-created_at']

    fieldsets = (
        (None, {'fields': ('id', 'invoice')}),
        ('Payment Details', {'fields': ('amount', 'payment_date', 'payment_method', 'transaction_id')}),
        ('Additional Info', {'fields': ('notes',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

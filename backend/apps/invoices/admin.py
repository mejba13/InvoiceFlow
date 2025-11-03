"""
Admin configuration for Invoice models
"""

from django.contrib import admin
from .models import Invoice, InvoiceItem


class InvoiceItemInline(admin.TabularInline):
    """Inline admin for InvoiceItem"""

    model = InvoiceItem
    extra = 1
    fields = ['description', 'quantity', 'unit_price', 'amount', 'order']
    readonly_fields = ['amount']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    """Admin for Invoice model"""

    list_display = ['invoice_number', 'client', 'status', 'total_amount', 'issue_date', 'due_date', 'created_at']
    list_filter = ['status', 'issue_date', 'due_date', 'created_at']
    search_fields = ['invoice_number', 'client__name', 'client__company_name']
    readonly_fields = ['id', 'invoice_number', 'subtotal', 'tax_amount', 'total_amount', 'created_at', 'updated_at', 'sent_at', 'paid_at']
    ordering = ['-created_at']
    inlines = [InvoiceItemInline]

    fieldsets = (
        (None, {'fields': ('id', 'user', 'client', 'invoice_number')}),
        ('Dates', {'fields': ('issue_date', 'due_date')}),
        ('Status', {'fields': ('status', 'sent_at', 'paid_at')}),
        ('Amounts', {'fields': ('subtotal', 'tax_amount', 'total_amount')}),
        ('Additional Info', {'fields': ('notes', 'terms')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    """Admin for InvoiceItem model"""

    list_display = ['description', 'invoice', 'quantity', 'unit_price', 'amount', 'order']
    list_filter = ['created_at']
    search_fields = ['description', 'invoice__invoice_number']
    readonly_fields = ['id', 'amount', 'created_at', 'updated_at']
    ordering = ['invoice', 'order']

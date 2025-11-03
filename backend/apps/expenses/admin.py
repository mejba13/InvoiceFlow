"""
Admin configuration for Expense model
"""

from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """Admin for Expense model"""

    list_display = ['description', 'amount', 'category', 'expense_date', 'vendor', 'tax_deductible', 'user', 'created_at']
    list_filter = ['category', 'tax_deductible', 'expense_date', 'created_at']
    search_fields = ['description', 'vendor', 'notes']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-expense_date', '-created_at']

    fieldsets = (
        (None, {'fields': ('id', 'user')}),
        ('Expense Details', {'fields': ('description', 'amount', 'category', 'expense_date', 'vendor')}),
        ('Receipt', {'fields': ('receipt',)}),
        ('Tax Info', {'fields': ('tax_deductible',)}),
        ('Additional Info', {'fields': ('notes',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

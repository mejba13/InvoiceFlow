"""
Admin configuration for Client model
"""

from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    """Admin for Client model"""

    list_display = ['name', 'email', 'company_name', 'user', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'email', 'company_name', 'phone']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('id', 'user')}),
        ('Client Information', {'fields': ('name', 'email', 'company_name', 'address', 'phone')}),
        ('Additional Info', {'fields': ('notes',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

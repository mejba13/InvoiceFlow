"""
Admin configuration for User model
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model"""

    list_display = ['email', 'first_name', 'last_name', 'business_name', 'is_active', 'is_staff', 'email_verified', 'created_at']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'email_verified', 'currency', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'business_name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_login', 'email_verified_at']

    fieldsets = (
        (None, {'fields': ('id', 'email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone')}),
        (_('Business info'), {'fields': ('business_name', 'business_logo', 'business_address', 'currency', 'tax_rate')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Email verification'), {'fields': ('email_verified', 'email_verified_at')}),
        (_('Important dates'), {'fields': ('last_login', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )

    def get_queryset(self, request):
        """Override to optimize queries"""
        qs = super().get_queryset(request)
        return qs.select_related()

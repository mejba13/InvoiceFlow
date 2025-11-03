"""
URL configuration for InvoiceFlow project
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Import viewsets
from apps.clients.views import ClientViewSet
from apps.invoices.views import InvoiceViewSet
from apps.payments.views import PaymentViewSet
from apps.expenses.views import ExpenseViewSet
from apps.reports.views import (
    DashboardView,
    IncomeReportView,
    ExpenseReportView,
    ClientReportView
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/auth/', include('apps.users.urls')),
    path('api/', include(router.urls)),

    # Reports endpoints
    path('api/reports/dashboard/', DashboardView.as_view(), name='dashboard'),
    path('api/reports/income/', IncomeReportView.as_view(), name='income-report'),
    path('api/reports/expenses/', ExpenseReportView.as_view(), name='expense-report'),
    path('api/reports/clients/', ClientReportView.as_view(), name='client-report'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

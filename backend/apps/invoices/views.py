"""
Views for Invoice management
"""

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Invoice, InvoiceItem
from .serializers import (
    InvoiceSerializer,
    InvoiceCreateUpdateSerializer,
    InvoiceActionSerializer
)


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Invoice CRUD operations

    list: GET /api/invoices/
    create: POST /api/invoices/
    retrieve: GET /api/invoices/{id}/
    update: PUT/PATCH /api/invoices/{id}/
    destroy: DELETE /api/invoices/{id}/
    """
    serializer_class = InvoiceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'client']
    search_fields = ['invoice_number', 'client__name', 'client__company_name']
    ordering_fields = ['issue_date', 'due_date', 'total_amount', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return invoices for the current user only"""
        return Invoice.objects.filter(user=self.request.user).select_related('client', 'user').prefetch_related('items')

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action in ['create', 'update', 'partial_update']:
            return InvoiceCreateUpdateSerializer
        return InvoiceSerializer

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Mark invoice as sent"""
        invoice = self.get_object()
        invoice.mark_as_sent()
        serializer = self.get_serializer(invoice)
        return Response({
            'invoice': serializer.data,
            'message': 'Invoice marked as sent'
        })

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        invoice.mark_as_paid()
        serializer = self.get_serializer(invoice)
        return Response({
            'invoice': serializer.data,
            'message': 'Invoice marked as paid'
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel invoice"""
        invoice = self.get_object()
        invoice.status = 'CANCELLED'
        invoice.save()
        serializer = self.get_serializer(invoice)
        return Response({
            'invoice': serializer.data,
            'message': 'Invoice cancelled'
        })

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue invoices"""
        overdue_invoices = [inv for inv in self.get_queryset() if inv.is_overdue()]
        serializer = self.get_serializer(overdue_invoices, many=True)
        return Response(serializer.data)

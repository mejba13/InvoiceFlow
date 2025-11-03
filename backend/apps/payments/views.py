"""
Views for Payment management
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment CRUD operations

    list: GET /api/payments/
    create: POST /api/payments/
    retrieve: GET /api/payments/{id}/
    update: PUT/PATCH /api/payments/{id}/
    destroy: DELETE /api/payments/{id}/
    """
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['invoice', 'payment_method']
    search_fields = ['transaction_id', 'invoice__invoice_number']
    ordering_fields = ['payment_date', 'amount', 'created_at']
    ordering = ['-payment_date']

    def get_queryset(self):
        """Return payments for the current user's invoices only"""
        return Payment.objects.filter(
            invoice__user=self.request.user
        ).select_related('invoice', 'invoice__client')

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action in ['create', 'update', 'partial_update']:
            return PaymentCreateSerializer
        return PaymentSerializer

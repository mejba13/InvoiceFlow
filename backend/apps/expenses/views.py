"""
Views for Expense management
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Expense
from .serializers import ExpenseSerializer, ExpenseCreateUpdateSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Expense CRUD operations

    list: GET /api/expenses/
    create: POST /api/expenses/
    retrieve: GET /api/expenses/{id}/
    update: PUT/PATCH /api/expenses/{id}/
    destroy: DELETE /api/expenses/{id}/
    """
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tax_deductible']
    search_fields = ['description', 'vendor', 'notes']
    ordering_fields = ['expense_date', 'amount', 'created_at']
    ordering = ['-expense_date']

    def get_queryset(self):
        """Return expenses for the current user only"""
        return Expense.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action in ['create', 'update', 'partial_update']:
            return ExpenseCreateUpdateSerializer
        return ExpenseSerializer

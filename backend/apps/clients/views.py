"""
Views for Client management
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client
from .serializers import ClientSerializer, ClientCreateUpdateSerializer


class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Client CRUD operations

    list: GET /api/clients/
    create: POST /api/clients/
    retrieve: GET /api/clients/{id}/
    update: PUT/PATCH /api/clients/{id}/
    destroy: DELETE /api/clients/{id}/
    """
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'company_name', 'phone']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return clients for the current user only"""
        return Client.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action in ['create', 'update', 'partial_update']:
            return ClientCreateUpdateSerializer
        return ClientSerializer

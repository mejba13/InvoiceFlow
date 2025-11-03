"""
Serializers for Client model
"""

from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for Client model"""

    total_invoiced = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()
    total_outstanding = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = [
            'id', 'name', 'email', 'company_name', 'address', 'phone',
            'notes', 'total_invoiced', 'total_paid', 'total_outstanding',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_invoiced(self, obj):
        """Get total amount invoiced to this client"""
        return float(obj.get_total_invoiced())

    def get_total_paid(self, obj):
        """Get total amount paid by this client"""
        return float(obj.get_total_paid())

    def get_total_outstanding(self, obj):
        """Get total outstanding amount from this client"""
        return float(obj.get_total_outstanding())


class ClientCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating clients"""

    class Meta:
        model = Client
        fields = [
            'name', 'email', 'company_name', 'address', 'phone', 'notes'
        ]

    def create(self, validated_data):
        """Create client for the current user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

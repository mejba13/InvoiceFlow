"""
Serializers for Payment model
"""

from rest_framework import serializers
from .models import Payment
from apps.invoices.models import Invoice


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""

    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    client_name = serializers.CharField(source='invoice.client.name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'invoice_number', 'client_name', 'amount',
            'payment_date', 'payment_method', 'transaction_id', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_invoice(self, value):
        """Validate that invoice belongs to the current user"""
        user = self.context['request'].user
        if value.user != user:
            raise serializers.ValidationError("You don't have permission to add payments to this invoice.")
        return value

    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than zero.")
        return value


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments"""

    class Meta:
        model = Payment
        fields = ['invoice', 'amount', 'payment_date', 'payment_method', 'transaction_id', 'notes']

    def validate_invoice(self, value):
        """Validate that invoice belongs to the current user"""
        user = self.context['request'].user
        if value.user != user:
            raise serializers.ValidationError("You don't have permission to add payments to this invoice.")
        return value

    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than zero.")
        return value

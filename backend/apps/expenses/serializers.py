"""
Serializers for Expense model
"""

from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for Expense model"""

    class Meta:
        model = Expense
        fields = [
            'id', 'description', 'amount', 'category', 'expense_date',
            'receipt', 'notes', 'vendor', 'tax_deductible',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExpenseCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating expenses"""

    class Meta:
        model = Expense
        fields = [
            'description', 'amount', 'category', 'expense_date',
            'receipt', 'notes', 'vendor', 'tax_deductible'
        ]

    def create(self, validated_data):
        """Create expense for the current user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Expense amount must be greater than zero.")
        return value

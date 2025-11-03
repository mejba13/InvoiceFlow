"""
Serializers for Invoice and InvoiceItem models
"""

from rest_framework import serializers
from .models import Invoice, InvoiceItem
from apps.clients.serializers import ClientSerializer


class InvoiceItemSerializer(serializers.ModelSerializer):
    """Serializer for InvoiceItem model"""

    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'amount', 'order']
        read_only_fields = ['id', 'amount']


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for Invoice model with related items"""

    items = InvoiceItemSerializer(many=True, read_only=True)
    client_details = ClientSerializer(source='client', read_only=True)
    amount_paid = serializers.SerializerMethodField()
    amount_due = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id', 'client', 'client_details', 'invoice_number', 'issue_date',
            'due_date', 'status', 'subtotal', 'tax_amount', 'total_amount',
            'notes', 'terms', 'sent_at', 'paid_at', 'items', 'amount_paid',
            'amount_due', 'is_overdue', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'invoice_number', 'subtotal', 'tax_amount', 'total_amount',
            'sent_at', 'paid_at', 'created_at', 'updated_at'
        ]

    def get_amount_paid(self, obj):
        """Get total amount paid for this invoice"""
        return float(obj.get_amount_paid())

    def get_amount_due(self, obj):
        """Get remaining amount due"""
        return float(obj.get_amount_due())

    def get_is_overdue(self, obj):
        """Check if invoice is overdue"""
        return obj.is_overdue()


class InvoiceCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating invoices with items"""

    items = InvoiceItemSerializer(many=True, required=False)

    class Meta:
        model = Invoice
        fields = [
            'client', 'issue_date', 'due_date', 'status', 'notes', 'terms', 'items'
        ]

    def create(self, validated_data):
        """Create invoice with items"""
        items_data = validated_data.pop('items', [])
        validated_data['user'] = self.context['request'].user

        invoice = Invoice.objects.create(**validated_data)

        # Create invoice items
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        return invoice

    def update(self, instance, validated_data):
        """Update invoice and its items"""
        items_data = validated_data.pop('items', None)

        # Update invoice fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update items if provided
        if items_data is not None:
            # Delete existing items
            instance.items.all().delete()

            # Create new items
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)

        return instance


class InvoiceActionSerializer(serializers.Serializer):
    """Serializer for invoice actions (send, mark as paid)"""

    action = serializers.ChoiceField(choices=['send', 'mark_paid', 'cancel'])

    def save(self, invoice):
        """Perform the action on the invoice"""
        action = self.validated_data['action']

        if action == 'send':
            invoice.mark_as_sent()
        elif action == 'mark_paid':
            invoice.mark_as_paid()
        elif action == 'cancel':
            invoice.status = 'CANCELLED'
            invoice.save()

        return invoice

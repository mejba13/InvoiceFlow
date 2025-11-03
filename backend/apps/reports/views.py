"""
Views for Dashboard and Reports
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from apps.invoices.models import Invoice
from apps.payments.models import Payment
from apps.expenses.models import Expense
from apps.clients.models import Client


class DashboardView(APIView):
    """
    API endpoint for dashboard statistics
    GET /api/reports/dashboard/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        first_day_of_month = today.replace(day=1)

        # Invoice statistics
        invoices = Invoice.objects.filter(user=user)
        total_outstanding = invoices.exclude(
            status__in=['PAID', 'CANCELLED']
        ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')

        # Paid this month
        paid_this_month = invoices.filter(
            status='PAID',
            paid_at__gte=first_day_of_month
        ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')

        # Pending invoices count
        pending_count = invoices.filter(
            status__in=['SENT', 'DRAFT']
        ).count()

        # Overdue invoices
        overdue_invoices = [inv for inv in invoices if inv.is_overdue()]
        overdue_count = len(overdue_invoices)
        overdue_amount = sum(inv.total_amount for inv in overdue_invoices)

        # Recent invoices
        recent_invoices = invoices.order_by('-created_at')[:5].values(
            'id', 'invoice_number', 'client__name', 'total_amount', 'status', 'due_date'
        )

        # Monthly revenue (last 6 months)
        monthly_revenue = []
        for i in range(6):
            month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
            next_month = (month_start + timedelta(days=32)).replace(day=1)

            revenue = invoices.filter(
                status='PAID',
                paid_at__gte=month_start,
                paid_at__lt=next_month
            ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')

            monthly_revenue.append({
                'month': month_start.strftime('%b %Y'),
                'revenue': float(revenue)
            })

        monthly_revenue.reverse()

        # Top clients
        top_clients = Client.objects.filter(user=user).annotate(
            total_invoiced=Sum('invoices__total_amount')
        ).order_by('-total_invoiced')[:5].values('name', 'company_name', 'total_invoiced')

        # Expense statistics
        expenses_this_month = Expense.objects.filter(
            user=user,
            expense_date__gte=first_day_of_month
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        return Response({
            'overview': {
                'total_outstanding': float(total_outstanding),
                'paid_this_month': float(paid_this_month),
                'pending_invoices': pending_count,
                'overdue_invoices': overdue_count,
                'overdue_amount': float(overdue_amount),
                'expenses_this_month': float(expenses_this_month),
            },
            'recent_invoices': list(recent_invoices),
            'monthly_revenue': monthly_revenue,
            'top_clients': list(top_clients),
        })


class IncomeReportView(APIView):
    """
    API endpoint for income reports
    GET /api/reports/income/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        invoices = Invoice.objects.filter(user=user, status='PAID')

        if start_date:
            invoices = invoices.filter(paid_at__gte=start_date)
        if end_date:
            invoices = invoices.filter(paid_at__lte=end_date)

        total_income = invoices.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')
        invoice_count = invoices.count()

        invoices_data = invoices.values(
            'invoice_number', 'client__name', 'total_amount', 'paid_at'
        ).order_by('-paid_at')

        return Response({
            'total_income': float(total_income),
            'invoice_count': invoice_count,
            'invoices': list(invoices_data)
        })


class ExpenseReportView(APIView):
    """
    API endpoint for expense reports
    GET /api/reports/expenses/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        expenses = Expense.objects.filter(user=user)

        if start_date:
            expenses = expenses.filter(expense_date__gte=start_date)
        if end_date:
            expenses = expenses.filter(expense_date__lte=end_date)

        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        tax_deductible = expenses.filter(tax_deductible=True).aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        # Group by category
        by_category = expenses.values('category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        expenses_data = expenses.values(
            'description', 'amount', 'category', 'expense_date', 'vendor'
        ).order_by('-expense_date')

        return Response({
            'total_expenses': float(total_expenses),
            'tax_deductible': float(tax_deductible),
            'by_category': list(by_category),
            'expenses': list(expenses_data)
        })


class ClientReportView(APIView):
    """
    API endpoint for client revenue reports
    GET /api/reports/clients/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        clients = Client.objects.filter(user=user).annotate(
            total_invoiced=Sum('invoices__total_amount'),
            total_paid=Sum(
                'invoices__total_amount',
                filter=Q(invoices__status='PAID')
            ),
            invoice_count=Count('invoices')
        ).order_by('-total_invoiced')

        clients_data = clients.values(
            'id', 'name', 'company_name', 'email',
            'total_invoiced', 'total_paid', 'invoice_count'
        )

        return Response({
            'clients': list(clients_data)
        })

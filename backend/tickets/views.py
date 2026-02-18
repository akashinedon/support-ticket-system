from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from .models import Ticket
from .serializers import TicketSerializer
from .llm import classify_ticket


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        qs = Ticket.objects.all()
        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status_filter = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if category:
            qs = qs.filter(category=category)
        if priority:
            qs = qs.filter(priority=priority)
        if status_filter:
            qs = qs.filter(status=status_filter)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        return qs


class TicketUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    http_method_names = ['patch']


@api_view(['GET'])
def stats_view(request):
    total = Ticket.objects.count()
    open_count = Ticket.objects.filter(status='open').count()

    # DB-level aggregation — no Python loops
    priority_qs = Ticket.objects.values('priority').annotate(count=Count('id'))
    category_qs = Ticket.objects.values('category').annotate(count=Count('id'))

    priority_breakdown = {item['priority']: item['count'] for item in priority_qs}
    category_breakdown = {item['category']: item['count'] for item in category_qs}

    # avg tickets per day using DB-level date grouping
    daily_counts = (
        Ticket.objects
        .annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(count=Count('id'))
    )
    avg_per_day = round(
        sum(d['count'] for d in daily_counts) / len(daily_counts), 1
    ) if daily_counts else 0

    return Response({
        "total_tickets": total,
        "open_tickets": open_count,
        "avg_tickets_per_day": avg_per_day,
        "priority_breakdown": priority_breakdown,
        "category_breakdown": category_breakdown,
    })


@api_view(['POST'])
def classify_view(request):
    description = request.data.get('description', '')
    if not description:
        return Response({"error": "description required"}, status=400)
    result = classify_ticket(description)
    return Response(result)
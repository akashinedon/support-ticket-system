from django.urls import path
from .views import TicketListCreateView, TicketUpdateView, stats_view, classify_view

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view()),
    path('tickets/<int:pk>/', TicketUpdateView.as_view()),
    path('tickets/stats/', stats_view),
    path('tickets/classify/', classify_view),
]
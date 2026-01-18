from django.shortcuts import render

from rest_framework import viewsets
from .models import Repuesto
from .serializers import RepuestoSerializer

class RepuestoViewSet(viewsets.ModelViewSet):
    queryset = Repuesto.objects.all()
    serializer_class = RepuestoSerializer
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepuestoViewSet

router = DefaultRouter()
router.register(r'repuestos', RepuestoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

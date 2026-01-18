from django.contrib import admin
from .models import Repuesto

@admin.register(Repuesto)
class RepuestoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'stock', 'precio')  # columnas visibles
    search_fields = ('nombre', 'codigo')                    # buscar por nombre o código
    list_filter = ('stock',)                                # filtro por stock
    ordering = ('nombre',)                                  # ordenar por nombre

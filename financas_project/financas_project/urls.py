from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # URL para acessar o admin
    path('', include('financasplus.urls')),  # Inclui as URLs do app 'financasplus'
]

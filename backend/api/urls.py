from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('client/', views.get_client, name='client'),
    path('positions/', views.get_positions, name='positions'),
]
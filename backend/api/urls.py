from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('is_authenticated/', views.is_authenticated_view, name='is_authenticated'),
    path('user/', views.get_user, name='user'),
    path('positions/', views.get_positions, name='positions'),
]
from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('user/', views.get_user, name='user'),
    path('add-recruiters/', views.add_recruiters, name='add_recruiter'),
    path('remove-recruiter/', views.remove_recruiter, name='remove_recruiter'),
    path('recruiters/', views.get_recruiters, name='recruiters'),
    path('positions/', views.get_positions, name='positions'),
    path('positions/<int:position_id>/', views.get_position, name='position'),
    path('candidates/', views.get_candidates, name='candidates'),
]
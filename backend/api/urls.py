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
    path('delete-position/<int:position_id>/', views.delete_position, name='delete_position'),
    path('candidates/', views.get_candidates, name='candidates'),
    path('applications/<str:id>/', views.get_application, name='application'),
    path('add-status/', views.add_status, name='add_status'),
    path('delete-status/<str:status_id>/', views.delete_status, name='status'),
    path('apply/', views.apply, name='apply'),
    path('create-position/', views.create_position, name='create_position'),
    path('my-applications/', views.my_applications, name='my_applications'),
]
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Account
from .forms import LoginForm, RegisterForm

def index(request):
    return HttpResponse('hello world!')

def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = LoginForm(data)
            if form.is_valid():
                user = form.get_user()
                if user is not None:
                    login(request, user)
                    return JsonResponse({'message': 'Login successful'}, status=200)
                else:
                    return JsonResponse({'message': 'Invalid credentials'}, status=400)
            else:
                print(form.errors)
                return JsonResponse({'message': 'Invalid form data', 'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = RegisterForm(data)
            if form.is_valid():
                print('form is valid')
                form.save()
                return JsonResponse({'message': 'Registration successful'}, status=201)
            print('form is invalid')
            print(form.errors)
            return JsonResponse({'message': 'Invalid form data', 'errors': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful'}, status=200)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)

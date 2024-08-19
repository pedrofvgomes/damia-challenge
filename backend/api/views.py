from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST, require_GET
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Account, Position, JobApplication
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    try:
        user = Account.objects.get(username=username)

        if not user.is_active:
            return JsonResponse({'message': 'Account is inactive'}, status=400)
                        
        user = authenticate(request, username=username, password=password)
        
        if user is None:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)
        
        login(request, user)
        
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=200)

    except Account.DoesNotExist:
        return JsonResponse({'message': 'User does not exist'}, status=400)

@csrf_exempt
@require_POST
def register_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if password != confirm_password:
        return JsonResponse({'message': 'Passwords do not match'}, status=400)
    
    if Account.objects.filter(username=username).exists():
        return JsonResponse({'message': 'Username already exists'}, status=400)
    
    if Account.objects.filter(email=email).exists():
        return JsonResponse({'message': 'Email already exists'}, status=400)
    
    account = Account.objects.create_user(username=username, email=email, password=password)
    account.save()
    
    return JsonResponse({'message': 'Registration successful'}, status=201)

@csrf_exempt
@require_POST
def logout_view(request):
    data = json.loads(request.body)
    refresh_token = data.get('refresh')
    try:
        RefreshToken(refresh_token).blacklist()
        return JsonResponse({'message': 'Logout successful'}, status=200)
    except TokenError:
        return JsonResponse({'message': 'Invalid token'}, status=400)

@csrf_exempt
@require_GET
def is_authenticated_view(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            access_token = RefreshToken(token)
            return JsonResponse({'token': str(access_token)}, status=200)
        except TokenError:
            return JsonResponse({'message': 'Invalid token'}, status=401)
    return JsonResponse({'message': 'No token provided'}, status=401)

@csrf_exempt
@require_GET
def get_user(request):
    username = request.GET.get('username')
    
    if Account.objects.filter(username=username).exists():
        user = Account.objects.filter(username=username).first()
        return JsonResponse(user.to_json(), status=200)
    
    return JsonResponse({'message': 'User is not authenticated or does not match'}, status=401)


@csrf_exempt
@require_GET
def get_positions(request):
    # validate token
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            # token validated
            access_token = RefreshToken(token)
            
            # get recruiter
            recruiter = Account.objects.get(username=access_token['username']).recruiter
            
            # get positions
            positions = Position.objects.filter(recruiter=recruiter)
            positions_json = [{
                    'id': position.id,
                    'title': position.title,
                    'location': position.location,
                    'date_posted': position.timestamp,
                    'number_of_applicants': JobApplication.objects.filter(position=position).count()
                    } for position in positions]
            
            return JsonResponse({'positions': positions_json}, status=200)
        except TokenError:
            return JsonResponse({'message': 'Invalid token'}, status=401)
    else:
        return JsonResponse({'message': 'No token provided'}, status=401)
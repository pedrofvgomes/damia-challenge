from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Account, Position, JobApplication, Client, Recruiter
import json

@csrf_exempt
@require_POST
def login_view(request):
    """
    Handles user login. Authenticates the user.
    """
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login successful'}, status=200)
    else:
        return JsonResponse({'message': 'Invalid credentials'}, status=400)


@csrf_exempt
@require_POST
def register_view(request):
    """
    Handles user registration. Creates a new user and returns a success message.
    """
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
    
    # Create client by default for the registered user (if needed)
    client = Client.objects.create(account=account)
    client.save()
    
    return JsonResponse({'message': 'Registration successful'}, status=201)


def get_client(request):
    """
    Returns the client's information.
    """
    # Assume the user is authenticated via session for now
    user = request.user

    try:
        client = Client.objects.get(account=user)
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client not found.'}, status=404)

    client_json = {
        'id': client.id,
        'username': client.account.username,
        'name': f'{client.account.first_name} {client.account.last_name}',
        'email': client.account.email,
        'location': client.location,
        'website': client.website,
        'phone': client.phone
    }
    
    return JsonResponse({'client': client_json}, status=200)


def get_positions(request):
    """
    Returns the list of positions for the authenticated recruiter.
    """
    # Assume the user is authenticated via session for now
    recruiter = Recruiter.objects.get(account=Account.objects.get(username='recruiter2_1'))
    
    positions = Position.objects.filter(recruiter=recruiter)
    positions_json = [{
        'id': position.id,
        'name': position.title,
        'location': position.location,
        'datePosted': position.timestamp,
        'numberOfApplicants': JobApplication.objects.filter(position=position).count()
    } for position in positions]

    return JsonResponse({'positions': positions_json}, status=200)
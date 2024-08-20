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

def get_position(request, position_id):
    """
    Returns the position's information.
    """

    try:
        position = Position.objects.get(id=position_id)
    except Position.DoesNotExist:
        return JsonResponse({'error': 'Position not found.'}, status=404)
    
    position_json = {
        'id': position.id,
        'name': position.title,
        'description': position.description,
        'location': position.location,
        'datePosted': position.timestamp,
        'numberOfApplicants': JobApplication.objects.filter(position=position).count(),
        'salary': f'${position.salary_min} - ${position.salary_max}',
        'recruiter': {
            'id': position.recruiter.id,
            'name': f'{position.recruiter.account.first_name} {position.recruiter.account.last_name}',
            'email': position.recruiter.account.email
        },
        'client': {
            'id': position.recruiter.client.id,
            'name': f'{position.recruiter.client.account.first_name} {position.recruiter.client.account.last_name}',
            'email': position.recruiter.client.account.email
        },
        'candidates': [{
            'id': application.candidate.id,
            'name': f'{application.candidate.account.first_name} {application.candidate.account.last_name}',
            'email': application.candidate.account.email,
            'statuses': [{
                'status': status.status,
                'timestamp': status.timestamp
            } for status in application.statuses.all()]
        } for application in JobApplication.objects.filter(position=position)]
    }
    
    return JsonResponse({'position': position_json}, status=200)

def get_candidates(request):
    """
    Returns the list of candidates for the authenticated recruiter, along with their positions, status, and last status update.
    """
    # Assume the user is authenticated via session for now
    recruiter = Recruiter.objects.get(account=Account.objects.get(username='recruiter2_1'))
    
    # Get all positions associated with the recruiter
    positions = Position.objects.filter(recruiter=recruiter)
    
    candidates_json = []
    
    for position in positions:
        # Get all job applications for this position
        applications = JobApplication.objects.filter(position=position).select_related('candidate', 'position')
        
        for application in applications:
            # Fetch the most recent status update for the candidate
            latest_status = application.statuses.order_by('-timestamp').first()
            
            candidates_json.append({
                'id': application.candidate.id,
                'name': f'{application.candidate.account.first_name} {application.candidate.account.last_name}',
                'position': position.title,
                'status': latest_status.status,
                'lastStatusUpdate': latest_status.timestamp
            })
    
    return JsonResponse({'candidates': candidates_json}, status=200)

def get_recruiters(request):
    search = request.GET.get('search', None)
    recruiters_json = []
    
    """
    Returns the list of recruiters for the authenticated client.
    
    If the search parameter is provided, returns the list of recruiters that match the search query
    and that are not associated to any client.
    """
    # Assume the user is authenticated via session for now
    client = Client.objects.get(account=Account.objects.get(username='client1'))
    
    if search is None:
        recruiters = Recruiter.objects.filter(client=client)
        recruiters_json = [{
            'id': recruiter.id,
            'name': f'{recruiter.account.first_name} {recruiter.account.last_name}',
            'email': recruiter.account.email
        } for recruiter in recruiters]
    else:
        # the recruiter can't 
        recruiters = Recruiter.objects.filter(account__username__icontains=search, client=None)
        recruiters_json = [{
            'id': recruiter.id,
            'name': f'{recruiter.account.first_name} {recruiter.account.last_name}',
            'email': recruiter.account.email
        } for recruiter in recruiters]
        
    return JsonResponse({'recruiters': recruiters_json}, status=200)

@csrf_exempt
@require_POST
def add_recruiters(request):
    """
    Adds recruiters to the client's account.
    """
    data = json.loads(request.body)
    print(data)
    recruiter_ids = data.get('recruiterIds')
    
    # Assume the user is authenticated via session for now
    client = Client.objects.get(account=Account.objects.get(username='client1'))
    
    for recruiter_id in recruiter_ids:
        recruiter = Recruiter.objects.get(id=recruiter_id)
        recruiter.client = client
        recruiter.save()
    
    return JsonResponse({'message': 'Recruiters added successfully'}, status=200)

def get_user(request):
    """
    Returns the authenticated user's information.
    """
    # Assume the user is authenticated via session for now
    user = Account.objects.get(username='recruiter2_1')
    
    user_json = {
        'id': user.id,
        'username': user.username,
        'name': f'{user.first_name} {user.last_name}',
        'email': user.email,
        'user_type': user.user_type
    }
    
    return JsonResponse({'user': user_json}, status=200)

@require_POST
@csrf_exempt
def remove_recruiter(request):
    """
    Removes a recruiter from the client's account.
    """
    data = json.loads(request.body)
    recruiter_id = data.get('recruiter_id')
    
    # Assume the user is authenticated via session for now
    client = Client.objects.get(account=Account.objects.get(username='client1'))
    
    recruiter = Recruiter.objects.get(id=recruiter_id)
    recruiter.client = None
    recruiter.save()
    
    return JsonResponse({'message': 'Recruiter removed successfully'}, status=200)
from api.models import JobApplication, Candidate, Recruiter, Position, ApplicationStatus, Account, Client
from django.utils import timezone
from django.contrib.auth.hashers import make_password

def exec():
    client_account = Account.objects.create(
        username='teste123',
        email='teste@email.com',
        password=make_password('12345678'),  # Make sure the password is hashed
        first_name='Cliente',
        last_name='Teste',
        user_type='client'
    )

    # Create the client profile
    client_profile = Client.objects.create(
        account=client_account,
        location='Gaia',
    )

    print(f'Client "{client_profile.account.username}" created successfully!')
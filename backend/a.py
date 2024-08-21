from api.models import JobApplication, Candidate, Recruiter, Position, ApplicationStatus, Account, Client, JOB_APPLICATION_STATUS
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.core.files import File
import os
import random

def exec():
    # Helper function to get or create an Account with first and last names
    def get_or_create_account(username, email, password, user_type, first_name='', last_name=''):
        print(f"Creating account for username: {username}, email: {email}")
        account, created = Account.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'password': make_password(password),
                'user_type': user_type,
                'first_name': first_name,
                'last_name': last_name
            }
        )
        if not created:
            # If not created, update the existing account
            account.email = email
            account.password = make_password(password)
            account.user_type = user_type
            account.first_name = first_name
            account.last_name = last_name
            account.save()
        print(f"Account {'created' if created else 'updated'}: {account.username}")
        return account

    # Create Damia Client
    print("Creating Damia Client...")
    damia_client_account = get_or_create_account(
        'damia-client', 'damia-client@example.com', '12345678', 'client', 'Damia', 'Client'
    )
    damia_client, created = Client.objects.get_or_create(account=damia_client_account)
    print(f"Damia Client {'created' if created else 'exists'}.")

    # Create Damia Recruiter
    print("Creating Damia Recruiter...")
    damia_recruiter_account = get_or_create_account(
        'damia-recruiter', 'damia-recruiter@example.com', '12345678', 'recruiter', 'Damia', 'Recruiter'
    )
    damia_recruiter, created = Recruiter.objects.get_or_create(account=damia_recruiter_account, client=damia_client)
    print(f"Damia Recruiter {'created' if created else 'exists'}.")

    # Create Damia Candidate
    print("Creating Damia Candidate...")
    damia_candidate_account = get_or_create_account(
        'damia-candidate', 'damia-candidate@example.com', '12345678', 'candidate', 'Damia', 'Candidate'
    )
    damia_candidate, created = Candidate.objects.get_or_create(
        account=damia_candidate_account,
        defaults={
            'resume': None,
            'cover_letter': 'Cover letter for Damia Candidate.'
        }
    )
    print(f"Damia Candidate {'created' if created else 'exists'}.")

    # Create 10 Recruiters for Damia Client
    print("Creating 10 Recruiters for Damia Client...")
    recruiter_accounts = []
    for i in range(10):
        username = f'recruiter-{i + 1}'
        email = f'recruiter-{i + 1}@example.com'
        first_name = f'Recruiter{i + 1}'
        last_name = f'LastName{i + 1}'
        recruiter_accounts.append(get_or_create_account(username, email, '12345678', 'recruiter', first_name, last_name))

    recruiters = []
    for acc in recruiter_accounts:
        recruiter, created = Recruiter.objects.get_or_create(account=acc, client=damia_client)
        recruiters.append(recruiter)
        print(f"Recruiter {acc.username} {'created' if created else 'exists'}.")

    # Create 20 Candidates
    print("Creating 20 Candidates...")
    candidate_accounts = []
    for i in range(20):
        username = f'candidate-{i + 1}'
        email = f'candidate-{i + 1}@example.com'
        first_name = f'Candidate{i + 1}'
        last_name = f'LastName{i + 1}'
        candidate_accounts.append(get_or_create_account(username, email, '12345678', 'candidate', first_name, last_name))

    candidates = []
    for acc in candidate_accounts:
        candidate, created = Candidate.objects.get_or_create(
            account=acc,
            defaults={
                'resume': None,
                'cover_letter': f'Cover letter for {acc.username}.'
            }
        )
        candidates.append(candidate)
        print(f"Candidate {acc.username} {'created' if created else 'exists'}.")

    # Create 2 Positions for Each Recruiter
    print("Creating 2 Positions for Each Recruiter...")
    positions = []
    for recruiter in recruiters:
        for i in range(2):
            position, created = Position.objects.get_or_create(
                recruiter=recruiter,
                title=f'Position {i + 1} for {recruiter.account.username}',
                defaults={
                    'description': f'Description for Position {i + 1} posted by {recruiter.account.username}',
                    'timestamp': timezone.now(),
                    'location': f'Location {i + 1}',
                    'salary_min': 50000 + (i * 1000),
                    'salary_max': 70000 + (i * 1000)
                }
            )
            positions.append(position)
            print(f"Position {position.title} {'created' if created else 'exists'}.")

    # Create Job Applications
    print("Creating Job Applications...")
    for candidate in candidates:
        applied_positions = random.sample(positions, min(3, len(positions)))  # Apply to up to 3 positions
        for position in applied_positions:
            job_application, created = JobApplication.objects.get_or_create(
                position=position,
                candidate=candidate,
                defaults={
                    'resume': None,
                    'cover_letter': f'Cover letter for application by {candidate.account.username} to position {position.title}'
                }
            )
            print(f"Job Application for {candidate.account.username} to {position.title} {'created' if created else 'exists'}.")

    # Create Application Statuses
    print("Creating Application Statuses...")
    application_statuses = []
    for status in JOB_APPLICATION_STATUS:
        app_status, created = ApplicationStatus.objects.get_or_create(
            status=status[0],
            defaults={
                'timestamp': timezone.now()
            }
        )
        application_statuses.append(app_status)
        print(f"Application Status {status[1]} {'created' if created else 'exists'}.")

    # Assign random statuses to each job application
    print("Assigning statuses to job applications...")
    for job_application in JobApplication.objects.all():
        status = random.choice(application_statuses)
        job_application.statuses.clear()
        job_application.statuses.add(status)
        job_application.save()
        print(f"Assigned status {status.status} to job application {job_application.id}.")

    print("Database populated with test data and statuses assigned.")

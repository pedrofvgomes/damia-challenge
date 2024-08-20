import random
import django
from django.utils import timezone
from api.models import Account, Client, Recruiter, Candidate, Position, JobApplication, ApplicationStatus

# Setup Django environment (adjust the path to your Django project settings)
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def populate_db():
    # Step 1: Create Clients (Companies)
    clients = []
    for i in range(1, 4):
        account = Account.objects.create_user(
            username=f'client{i}',
            email=f'client{i}@company.com',
            password='password123',
            first_name=f'ClientFirst{i}',
            last_name=f'ClientLast{i}',
            user_type='client'
        )
        client = Client.objects.create(account=account, location=f'Location {i}', website=f'http://client{i}.com', phone=f'123-456-78{i}9')
        clients.append(client)

    # Step 2: Create 2 Recruiters per Client
    recruiters = []
    for client in clients:
        for j in range(1, 3):
            account = Account.objects.create_user(
                username=f'recruiter{client.id}_{j}',
                email=f'recruiter{client.id}_{j}@company.com',
                password='password123',
                first_name=f'RecruiterFirst{client.id}_{j}',
                last_name=f'RecruiterLast{client.id}_{j}',
                user_type='recruiter'
            )
            recruiter = Recruiter.objects.create(account=account, client=client)
            recruiters.append(recruiter)

    # Step 3: Create 3 Positions for each Client (Each recruiter gets one)
    positions = []
    for i, recruiter in enumerate(recruiters):
        for k in range(1, 4):
            position = Position.objects.create(
                recruiter=recruiter,
                title=f'Position {i+1}-{k}',
                description=f'Job description for position {i+1}-{k}',
                timestamp=timezone.now(),
                location=f'Location {i+1}-{k}',
                salary_min=random.randint(50000, 70000),
                salary_max=random.randint(80000, 120000)
            )
            positions.append(position)

    # Step 4: Create 5 Candidates for each Position
    candidates = []
    for position in positions:
        for l in range(1, 6):
            account = Account.objects.create_user(
                username=f'candidate{position.id}_{l}',
                email=f'candidate{position.id}_{l}@mail.com',
                password='password123',
                first_name=f'CandidateFirst{position.id}_{l}',
                last_name=f'CandidateLast{position.id}_{l}',
                user_type='candidate'
            )
            candidate = Candidate.objects.create(account=account)
            candidates.append(candidate)

            # Step 5: Create a Job Application for each Candidate
            job_application = JobApplication.objects.create(
                position=position,
                candidate=candidate
            )

            # Step 6: Create an initial status for each application
            initial_status = ApplicationStatus.objects.create(
                status='received',
                timestamp=timezone.now()
            )
            job_application.statuses.add(initial_status)

if __name__ == '__main__':
    populate_db()
    print("Database populated successfully!")

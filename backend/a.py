from api.models import JobApplication, Candidate, Recruiter, Position, ApplicationStatus
from django.utils import timezone

def exec():
    # Find the recruiter by username
    recruiter = Recruiter.objects.get(account__username='recruiter2_1')

    # Assuming a position exists for that recruiter, you can get the first position available
    position = Position.objects.filter(recruiter=recruiter).last()

    # Assuming you have a candidate already created
    candidate = Candidate.objects.get(account__username='candidate1_1')  # Replace with actual candidate's username

    # Create a new job application
    job_application = JobApplication.objects.create(
        position=position,
        candidate=candidate,
        resume='/resumes/example.pdf',
        cover_letter='This is a sample cover letter for the application.'
    )

    # Create an initial status for the application (received)
    initial_status = ApplicationStatus.objects.create(
        status='received',
        timestamp=timezone.now()
    )

    # Attach the status to the job application
    job_application.statuses.add(initial_status)

    # Save the job application
    job_application.save()

    print(f"Job Application created for {candidate.account.username} to {position.title}")

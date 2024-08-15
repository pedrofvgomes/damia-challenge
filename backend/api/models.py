from django.db import models
from django.contrib.auth.models import AbstractUser

"""
This model will represent accounts, to which every type of 
user will associate.

It inherits from Django's AbstractUser, which makes the job easier.
"""
class Account(AbstractUser):
    ACCOUNT_TYPE_CHOICES = (
        ('client', 'Client'),
        ('recruiter', 'Recruiter'),
        ('candidate', 'Candidate')
    )
    
    user_type = models.CharField(max_length=50, choices=ACCOUNT_TYPE_CHOICES)
    
"""
This model represents a client, for instance, a company that's 
using our service.

Every recruiter and job opening will be associated to an instance 
of Client.
"""
class Client(models.Model):
    # account the client is associated to
    account = models.OneToOneField(Account, on_delete=models.CASCADE)

    # custom fields
    name = models.CharField(max_length=255)
    
"""
This model represents a recruiter, which is associated to a Client.

Job openings will be associated to a recruiter.
"""
class Recruiter(models.Model):
    # account the recruiter is associated to
    account = models.OneToOneField(Account, on_delete=models.CASCADE)
    
    # client the recruiter is associated to
    account = models.ForeignKey(Client, on_delete=models.CASCADE)
    
    # custom fields
    
"""
Candidates won't be associated to any model besides Account.

Job applications will be associated to a candidate.
"""
class Candidate(models.Model):
    # account the recruiter is associated to
    account = models.OneToOneField(Account, on_delete=models.CASCADE)
    
    # custom fields

"""
Each job opening is associated to a recruiter, by whom it was posted,
which is then associated to a client.
"""    
class JobOpening(models.Model):
    # recruiter the opening is associated to
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE)
    
    # custom fields
    title = models.CharField(max_length=255)
    description = models.TextField()
    timestamp = models.DateTimeField()

"""
This model represents a job application made by a candidate 
for a specific job opening.
"""
class JobApplication(models.Model):
    # job opening the application is for
    job_opening = models.ForeignKey(JobOpening, on_delete=models.CASCADE)
    
    # candidate the application was made by
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
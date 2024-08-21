# Job Application Management System

## Overview

This system is designed to manage job applications within companies. It allows candidates to apply for positions and track their application status, while recruiters can manage job positions and applicants.

### Features

- **Candidates**:
  - Can search for existing positions and apply to them once.
  - Can view the status of their applications.

- **Recruiters**:
  - Can create, manage, and remove job positions.
  - Can update the status of applications.
  - Can manage applicants for their positions.

- **Clients**:
  - Clients can only be created by us (the development team). They do not have the ability to create or manage job positions.

- **User Roles**:
  - Any user who creates an account will initially be a candidate.
  - Candidates can be upgraded to recruiters by client invitation. Once invited, they gain recruiter privileges and can be removed by the client if needed.

## Installation and Running
You should open two separate terminals, one for backend and another for frontend.

### Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Apply database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

3. Start the backend server:
    ```bash
    python manage.py runserver
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm run dev
    ```

## Notes

- **User Creation**: Candidates are created by default when a user signs up. Clients can invite candidates to become recruiters.
- **Recruiter Role**: Recruiters are added instantly when invited by a client and can be removed at any time.
- **Client Creation**: Clients can only be created by us (the development team). They do not have permissions to create or manage job positions.
- **Functionality**:
  - Recruiters can create, manage, and remove job positions and update application statuses.
  - Candidates can apply to each position only once and view their application status.

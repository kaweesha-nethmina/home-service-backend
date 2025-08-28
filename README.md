# Home Service Backend

This README lists the API endpoints available in this repository.

## Base URL

Assume the server runs on:

- http://localhost:5000 (adjust port as configured in `app.js`)

All routes are mounted with the `/api` prefix as configured in `app.js`. The full paths below include that prefix.

## Authentication


- POST /api/auth/signup — Register a new user
- POST /api/auth/login — Login and receive auth token
- GET /api/auth/profile — Get current user profile (requires Authorization header)
- PUT /api/auth/profile — Update current user profile (requires Authorization header)
- POST /api/auth/reset-password — Reset password (requires Authorization header)

## Bookings


- POST /api/bookings/ — Create a booking (requires Authorization header)
- GET /api/bookings/ — List bookings for the authenticated user (requires Authorization header)
- GET /api/bookings/:id — Get booking details by id (requires Authorization header)
- PUT /api/bookings/:id/status — Update booking status (requires Authorization header)
- DELETE /api/bookings/:id — Cancel a booking (requires Authorization header)

## Payments


- POST /api/payments/ — Make a payment for a booking (requires Authorization header)
- GET /api/payments/:id — Get payment details by id (requires Authorization header)

## Categories

These endpoints appear under both the categories router and the services router (under `/services/categories`).


- POST /api/categories/ — Create a category (requires Authorization header)
- GET /api/categories/ — List all categories
- PUT /api/categories/:id — Update a category (requires Authorization header)
- DELETE /api/categories/:id — Delete a category (requires Authorization header)

When mounted under services, they appear as:

- POST /services/categories/
- GET /services/categories/
- PUT /services/categories/:id
- DELETE /services/categories/:id

## Services


- POST /api/services/ — Create a service (requires Authorization header)
- GET /api/services/ — List all services
- GET /api/services/:id — Get service details by id
- PUT /api/services/:id — Update a service (requires Authorization header)
- DELETE /api/services/:id — Delete a service (requires Authorization header)

## Support (Complaints, Ratings, Notifications)

- POST /api/support/complaints — Raise a complaint (requires Authorization header)
- GET /api/support/complaints — Get complaints for the authenticated user (requires Authorization header)
- PUT /api/support/complaints/:id — Update complaint status (requires Authorization header)
- POST /api/support/ratings — Submit a rating (requires Authorization header)
- GET /api/support/ratings/provider/:id — Get ratings for a provider (requires Authorization header)
- POST /api/support/notifications — Create a user notification (requires Authorization header)
- GET /api/support/notifications — List user notifications (requires Authorization header)
- PUT /api/support/notifications/:id/read — Mark a notification as read (requires Authorization header)

Request/response examples:

### Complaints

- Raise a complaint (POST /api/support/complaints)
  - Request body:
    ```json
    {
      "subject": "Service Quality Issue",
      "description": "The service provider was late and did a poor job",
      "priority": "high"
    }
    ```
  - Response:
    ```json
    {
      "message": "Complaint raised successfully",
      "complaint": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1a",
        "user": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1b",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "subject": "Service Quality Issue",
        "description": "The service provider was late and did a poor job",
        "priority": "high",
        "status": "open",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T10:30:00.000Z"
      }
    }
    ```

- Get complaints (GET /api/support/complaints)
  - Response:
    ```json
    [
      {
        "_id": "60a8c1e2f3b4c42d1c9d2c1a",
        "user": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1b",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "assignedTo": null,
        "subject": "Service Quality Issue",
        "description": "The service provider was late and did a poor job",
        "priority": "high",
        "status": "open",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T10:30:00.000Z"
      }
    ]
    ```

- Update complaint status (PUT /api/support/complaints/:id)
  - Request body:
    ```json
    {
      "status": "in-progress",
      "assignedTo": "60a8c1e2f3b4c42d1c9d2c1c"
    }
    ```
  - Response:
    ```json
    {
      "message": "Complaint updated successfully",
      "complaint": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1a",
        "user": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1b",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "assignedTo": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1c",
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "subject": "Service Quality Issue",
        "description": "The service provider was late and did a poor job",
        "priority": "high",
        "status": "in-progress",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T11:45:00.000Z"
      }
    }
    ```

### Ratings

- Submit a rating (POST /api/support/ratings)
  - Request body:
    ```json
    {
      "providerId": "60a8c1e2f3b4c42d1c9d2c1c",
      "serviceId": "60a8c1e2f3b4c42d1c9d2c1d",
      "rating": 4,
      "feedback": "Good service, but could be improved"
    }
    ```
  - Response:
    ```json
    {
      "message": "Rating submitted successfully",
      "rating": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1e",
        "user": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1b",
          "name": "John Doe"
        },
        "provider": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1c",
          "name": "Jane Smith"
        },
        "service": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1d",
          "name": "Plumbing Service"
        },
        "rating": 4,
        "feedback": "Good service, but could be improved",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T10:30:00.000Z"
      }
    }
    ```

- Get provider ratings (GET /api/support/ratings/provider/:id)
  - Response:
    ```json
    [
      {
        "_id": "60a8c1e2f3b4c42d1c9d2c1e",
        "user": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1b",
          "name": "John Doe"
        },
        "provider": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1c",
          "name": "Jane Smith"
        },
        "service": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1d",
          "name": "Plumbing Service"
        },
        "rating": 4,
        "feedback": "Good service, but could be improved",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T10:30:00.000Z"
      }
    ]
    ```

### Notifications

- Create a notification (POST /api/support/notifications)
  - Request body (admin creating notification for user):
    ```json
    {
      "userId": "60a8c1e2f3b4c42d1c9d2c1b",
      "title": "Booking Confirmed",
      "message": "Your booking for plumbing service has been confirmed",
      "type": "success",
      "relatedBooking": "60a8c1e2f3b4c42d1c9d2c1f"
    }
    ```
  - Response:
    ```json
    {
      "message": "Notification created successfully",
      "notification": {
        "_id": "60a8c1e2f3b4c42d1c9d2c20",
        "user": {
          "_id": "60a8c1e2f3b4c42d1c9d2c1b",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "title": "Booking Confirmed",
        "message": "Your booking for plumbing service has been confirmed",
        "type": "success",
        "isRead": false,
        "relatedBooking": "60a8c1e2f3b4c42d1c9d2c1f",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T10:30:00.000Z"
      }
    }
    ```

- Get user notifications (GET /api/support/notifications)
  - Response:
    ```json
    [
      {
        "_id": "60a8c1e2f3b4c42d1c9d2c20",
        "user": "60a8c1e2f3b4c42d1c9d2c1b",
        "title": "Booking Confirmed",
        "message": "Your booking for plumbing service has been confirmed",
        "type": "success",
        "isRead": false,
        "relatedBooking": "60a8c1e2f3b4c42d1c9d2c1f",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T10:30:00.000Z"
      }
    ]
    ```

- Mark notification as read (PUT /api/support/notifications/:id/read)
  - Response:
    ```json
    {
      "message": "Notification marked as read",
      "notification": {
        "_id": "60a8c1e2f3b4c42d1c9d2c20",
        "user": "60a8c1e2f3b4c42d1c9d2c1b",
        "title": "Booking Confirmed",
        "message": "Your booking for plumbing service has been confirmed",
        "type": "success",
        "isRead": true,
        "relatedBooking": "60a8c1e2f3b4c42d1c9d2c1f",
        "createdAt": "2023-05-22T10:30:00.000Z",
        "updatedAt": "2023-05-22T11:45:00.000Z"
      }
    }
    ```

## Feedback System

Customers can submit feedback for service providers, and providers can view feedback from their customers.

- POST /api/feedback/ — Submit feedback (requires Authorization header)
- GET /api/feedback/customer — Get customer's feedback (requires Authorization header)
- PUT /api/feedback/:id — Update customer's feedback (requires Authorization header)
- DELETE /api/feedback/:id — Delete customer's feedback (requires Authorization header)
- GET /api/feedback/provider — Get provider's feedbacks (requires Authorization header)
- GET /api/feedback/provider/:providerId — Get public feedbacks for a provider
- GET /api/feedback/service/:serviceId — Get public feedbacks for a service

See [FEEDBACK_ENDPOINTS.md](FEEDBACK_ENDPOINTS.md) for detailed documentation with request/response examples.

## Providers (profiles & portfolio)

Providers (electricians, plumbers, etc.) can manage their public profile and upload works (portfolio items). Homeowners can view provider profiles and works.

- GET /api/providers/profile — Get the current authenticated provider profile (requires Authorization header)
- GET /api/providers/:id/profile — Get public provider profile by provider id
- PUT /api/providers/profile — Update provider profile (bio, skills, location, phone) (requires Authorization header)

Works (portfolio items):

- POST /api/providers/works — Add a work/portfolio item (requires Authorization header)
- GET /api/providers/works — Get current provider's works (requires Authorization header)
- GET /api/providers/:id/works — Get public works for a provider
- PUT /api/providers/works/:id — Update a work (requires Authorization header)
- DELETE /api/providers/works/:id — Delete a work (requires Authorization header)

Provider Bookings:

- GET /api/provider/bookings/ — Get all bookings for the provider (requires Authorization header)
- GET /api/provider/bookings/:id — Get specific booking details (requires Authorization header)
- PUT /api/provider/bookings/:id/status — Update booking status (requires Authorization header)
- DELETE /api/provider/bookings/:id — Delete a booking (requires Authorization header)

See [PROVIDER_BOOKING_ENDPOINTS.md](PROVIDER_BOOKING_ENDPOINTS.md) for detailed documentation with request/response examples.

Request shapes (examples):

- Add work (POST /api/providers/works)
	- body: { title, description, images: [url], date, serviceId }

- Upload image for work (POST /api/providers/upload/image)
Pagination (public works listing)

- GET /api/providers/:id/works?page=1&limit=10
	- query params:
		- page (default 1)
		- limit (default 10, max 100)
	- response: { total, page, limit, works }

	- form-data: key `image` (file)
	- returns: { message, url } where `url` is the relative path to the uploaded file (e.g. `/uploads/159...jpg`)


- Update profile (PUT /api/providers/profile)
	- body: { bio, skills: ["electrical", "plumbing"], location, phone }

These endpoints use `authMiddleware` to identify the provider via JWT (`req.user.userId`).

## Admin

Administrative endpoints for managing the platform (requires admin role and Authorization header):

- GET /api/admin/users — Get all users
- GET /api/admin/services — Get all services
- GET /api/admin/categories — Get all categories
- GET /api/admin/bookings — Get all bookings
- PUT /api/admin/bookings/:id/status — Update booking status
- GET /api/admin/feedbacks — Get all feedbacks
- GET /api/admin/feedbacks/:id — Get specific feedback by ID
- PUT /api/admin/feedbacks/:id — Update feedback
- DELETE /api/admin/feedbacks/:id — Delete feedback

See [ADMIN_FEEDBACK_ENDPOINTS.md](ADMIN_FEEDBACK_ENDPOINTS.md) for detailed documentation of feedback management endpoints.

## File Upload

Endpoints for file uploads (used by providers for portfolio images):

- POST /api/providers/upload/image — Upload an image file
  - Request:
    - form-data with key `image` containing the file
  - Response:
    ```json
    {
      "message": "File uploaded",
      "url": "/uploads/1621584912345-123456789.jpg"
    }
    ```

## Notes

- Endpoints marked "requires Authorization header" use the `authMiddleware` located in `middleware/authMiddleware.js`.
- Controller implementations are in the folders `auth/`, `bookings/`, `services/`, and `support/`.
- This README covers the routes defined under `routes/`. If routers are mounted under a prefix in `app.js`, prepend that prefix when making requests.

If you'd like, I can also add example curl/postman snippets and sample request/response shapes for each endpoint.

OpenAPI spec: `openapi.yaml` (minimal) added to the project root.

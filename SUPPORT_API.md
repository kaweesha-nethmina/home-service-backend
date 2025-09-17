# Support System API Endpoints

This document lists the API endpoints for the support system including notifications, complaints, ratings, and general support functionality.

## Base URL

Assume the server runs on:

- http://localhost:5000 (adjust port as configured in `app.js`)

All routes are mounted with the `/api/support` prefix as configured in `app.js`. The full paths below include that prefix.

## Authentication

All endpoints require JWT-based authentication using the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

## Complaints

### Raise a complaint
- **Endpoint**: POST /api/support/complaints
- **Description**: Create a new complaint
- **Request body**:
  ```json
  {
    "subject": "Service Quality Issue",
    "description": "The service provider was late and did a poor job",
    "priority": "high"
  }
  ```
- **Response**:
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

### Get complaints
- **Endpoint**: GET /api/support/complaints
- **Description**: Get all complaints for the authenticated user
- **Response**:
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

### Update complaint status
- **Endpoint**: PUT /api/support/complaints/:id
- **Description**: Update the status or assignment of a complaint
- **Request body**:
  ```json
  {
    "status": "in-progress",
    "assignedTo": "60a8c1e2f3b4c42d1c9d2c1c"
  }
  ```
- **Response**:
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

## Ratings

### Submit a rating
- **Endpoint**: POST /api/support/ratings
- **Description**: Submit a rating for a provider
- **Request body**:
  ```json
  {
    "providerId": "60a8c1e2f3b4c42d1c9d2c1c",
    "serviceId": "60a8c1e2f3b4c42d1c9d2c1d",
    "rating": 4,
    "feedback": "Good service, but could be improved"
  }
  ```
- **Response**:
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

### Get provider ratings
- **Endpoint**: GET /api/support/ratings/provider/:id
- **Description**: Get all ratings for a specific provider
- **Response**:
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

## Notifications

### Create a notification
- **Endpoint**: POST /api/support/notifications
- **Description**: Create a new notification (admin only for other users)
- **Request body** (admin creating notification for user):
  ```json
  {
    "userId": "60a8c1e2f3b4c42d1c9d2c1b",
    "title": "Booking Confirmed",
    "message": "Your booking for plumbing service has been confirmed",
    "type": "success",
    "relatedBooking": "60a8c1e2f3b4c42d1c9d2c1f"
  }
  ```
- **Response**:
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

### Get user notifications
- **Endpoint**: GET /api/support/notifications
- **Description**: Get all notifications for the authenticated user
- **Response**:
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

### Mark notification as read
- **Endpoint**: PUT /api/support/notifications/:id/read
- **Description**: Mark a notification as read
- **Response**:
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
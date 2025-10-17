# Admin Feedback Management API Endpoints

This document provides detailed documentation for the feedback management endpoints specifically designed for administrators. Admins can view all feedbacks, get specific feedback details, update feedback, and delete feedback.

## Base URL

Assume the server runs on:

- http://localhost:5000 (adjust port as configured in `app.js`)

All routes are mounted with the `/api/admin` prefix as configured in `app.js`. The full paths below include that prefix.

## Authentication

All endpoints require JWT-based authentication using the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```
Only users with the 'admin' role can access these endpoints.

## Admin Feedback Endpoints

### Get all feedbacks
- **Endpoint**: GET /api/admin/feedbacks
- **Description**: Get all feedbacks in the system
- **Authentication**: Required (Admin)
- **Response**:
  ```json
  [
    {
      "_id": "60a8c1e2f3b4c42d1c9d2c1a",
      "customer": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1b",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "provider": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1c",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "service": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1d",
        "name": "Plumbing Service"
      },
      "booking": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1e",
        "service": "60a8c1e2f3b4c42d1c9d2c1d",
        "date": "2023-05-22T10:00:00.000Z"
      },
      "rating": 4,
      "title": "Great Service Experience",
      "comment": "The service provider was punctual and did an excellent job. Highly recommended!",
      "isPublic": true,
      "status": "approved",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T10:30:00.000Z"
    }
  ]
  ```

### Get specific feedback by ID
- **Endpoint**: GET /api/admin/feedbacks/:id
- **Description**: Get details of a specific feedback by ID
- **Authentication**: Required (Admin)
- **Response**:
  ```json
  {
    "_id": "60a8c1e2f3b4c42d1c9d2c1a",
    "customer": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1b",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "provider": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1c",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "service": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1d",
      "name": "Plumbing Service"
    },
    "booking": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1e",
      "service": "60a8c1e2f3b4c42d1c9d2c1d",
      "date": "2023-05-22T10:00:00.000Z"
    },
    "rating": 4,
    "title": "Great Service Experience",
    "comment": "The service provider was punctual and did an excellent job. Highly recommended!",
    "isPublic": true,
    "status": "approved",
    "createdAt": "2023-05-22T10:30:00.000Z",
    "updatedAt": "2023-05-22T10:30:00.000Z"
  }
  ```

### Update feedback
- **Endpoint**: PUT /api/admin/feedbacks/:id
- **Description**: Update a feedback (admins can update any field including status)
- **Authentication**: Required (Admin)
- **Request body** (any of the following fields can be updated):
  ```json
  {
    "rating": 5,
    "title": "Outstanding Service Experience",
    "comment": "The service provider was punctual, professional, and did an outstanding job. Highly recommended!",
    "isPublic": true,
    "status": "approved"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Feedback updated successfully",
    "feedback": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1a",
      "customer": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1b",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "provider": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1c",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "service": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1d",
        "name": "Plumbing Service"
      },
      "booking": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1e",
        "service": "60a8c1e2f3b4c42d1c9d2c1d",
        "date": "2023-05-22T10:00:00.000Z"
      },
      "rating": 5,
      "title": "Outstanding Service Experience",
      "comment": "The service provider was punctual, professional, and did an outstanding job. Highly recommended!",
      "isPublic": true,
      "status": "approved",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T11:45:00.000Z"
    }
  }
  ```

### Delete feedback
- **Endpoint**: DELETE /api/admin/feedbacks/:id
- **Description**: Permanently delete a feedback
- **Authentication**: Required (Admin)
- **Response**:
  ```json
  {
    "message": "Feedback deleted successfully"
  }
  ```
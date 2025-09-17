# Feedback System API Endpoints

This document provides detailed documentation for the new feedback system endpoints that allow customers to submit, view, update, and delete feedback, and service providers to view feedbacks.

## Base URL

Assume the server runs on:

- http://localhost:5000 (adjust port as configured in `app.js`)

All routes are mounted with the `/api/feedback` prefix as configured in `app.js`. The full paths below include that prefix.

## Authentication

All endpoints except public feedback viewing require JWT-based authentication using the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

## Customer Endpoints

### Submit feedback
- **Endpoint**: POST /api/feedback/
- **Description**: Submit feedback for a service provider
- **Authentication**: Required (Customer)
- **Request body**:
  ```json
  {
    "providerId": "60a8c1e2f3b4c42d1c9d2c1c",
    "serviceId": "60a8c1e2f3b4c42d1c9d2c1d",
    "bookingId": "60a8c1e2f3b4c42d1c9d2c1e",
    "rating": 4,
    "title": "Great Service Experience",
    "comment": "The service provider was punctual and did an excellent job. Highly recommended!",
    "isPublic": true
  }
  ```
- **Response**:
  ```json
  {
    "message": "Feedback submitted successfully",
    "feedback": {
      "_id": "60a8c1e2f3b4c42d1c9d2c20",
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
      "status": "pending",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T10:30:00.000Z"
    }
  }
  ```

### Get customer's feedback
- **Endpoint**: GET /api/feedback/customer
- **Description**: Get all feedback submitted by the authenticated customer
- **Authentication**: Required (Customer)
- **Response**:
  ```json
  [
    {
      "_id": "60a8c1e2f3b4c42d1c9d2c20",
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
      "status": "pending",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T10:30:00.000Z"
    }
  ]
  ```

### Update feedback
- **Endpoint**: PUT /api/feedback/:id
- **Description**: Update the authenticated customer's feedback
- **Authentication**: Required (Customer)
- **Request body**:
  ```json
  {
    "rating": 5,
    "title": "Outstanding Service Experience",
    "comment": "The service provider was punctual, professional, and did an outstanding job. Highly recommended!",
    "isPublic": true
  }
  ```
- **Response**:
  ```json
  {
    "message": "Feedback updated successfully",
    "feedback": {
      "_id": "60a8c1e2f3b4c42d1c9d2c20",
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
      "status": "pending",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T11:45:00.000Z"
    }
  }
  ```

### Delete feedback
- **Endpoint**: DELETE /api/feedback/:id
- **Description**: Delete the authenticated customer's feedback
- **Authentication**: Required (Customer)
- **Response**:
  ```json
  {
    "message": "Feedback deleted successfully"
  }
  ```

## Service Provider Endpoints

### Get provider's feedbacks
- **Endpoint**: GET /api/feedback/provider
- **Description**: Get all feedback received by the authenticated service provider
- **Authentication**: Required (Provider)
- **Response**:
  ```json
  [
    {
      "_id": "60a8c1e2f3b4c42d1c9d2c20",
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
      "status": "pending",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T11:45:00.000Z"
    }
  ]
  ```

## Public Endpoints

### Get public feedbacks for a provider
- **Endpoint**: GET /api/feedback/provider/:providerId
- **Description**: Get all public feedback for a specific service provider
- **Authentication**: Not required
- **Response**:
  ```json
  [
    {
      "_id": "60a8c1e2f3b4c42d1c9d2c20",
      "customer": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1b",
        "name": "John Doe"
      },
      "provider": "60a8c1e2f3b4c42d1c9d2c1c",
      "service": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1d",
        "name": "Plumbing Service"
      },
      "rating": 5,
      "title": "Outstanding Service Experience",
      "comment": "The service provider was punctual, professional, and did an outstanding job. Highly recommended!",
      "isPublic": true,
      "status": "approved",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T11:45:00.000Z"
    }
  ]
  ```

### Get feedbacks for a service
- **Endpoint**: GET /api/feedback/service/:serviceId
- **Description**: Get all public feedback for a specific service
- **Authentication**: Not required
- **Response**:
  ```json
  [
    {
      "_id": "60a8c1e2f3b4c42d1c9d2c20",
      "customer": {
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
      "rating": 5,
      "title": "Outstanding Service Experience",
      "comment": "The service provider was punctual, professional, and did an outstanding job. Highly recommended!",
      "isPublic": true,
      "status": "approved",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T11:45:00.000Z"
    }
  ]
  ```
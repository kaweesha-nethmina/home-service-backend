# Provider Booking Management API Endpoints

This document provides detailed documentation for the booking management endpoints specifically designed for service providers. Providers can view their bookings, update booking statuses, and delete bookings.

## Base URL

Assume the server runs on:

- http://localhost:5000 (adjust port as configured in `app.js`)

All routes are mounted with the `/api/provider/bookings` prefix as configured in `app.js`. The full paths below include that prefix.

## Authentication

All endpoints require JWT-based authentication using the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```
Only users with the 'provider' role can access these endpoints.

## Provider Booking Endpoints

### Get all bookings for provider
- **Endpoint**: GET /api/provider/bookings/
- **Description**: Get all bookings for the authenticated provider
- **Authentication**: Required (Provider)
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
      "service": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1c",
        "name": "Plumbing Service",
        "price": 1500
      },
      "provider": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1d",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "date": "2023-05-25T10:00:00.000Z",
      "status": "pending",
      "totalPrice": 1500,
      "address": "123 Main St, Colombo",
      "notes": "Please arrive early",
      "customerName": "John Doe",
      "customerPhone": "+94771234567",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T10:30:00.000Z"
    }
  ]
  ```

### Get specific booking details
- **Endpoint**: GET /api/provider/bookings/:id
- **Description**: Get details of a specific booking by ID
- **Authentication**: Required (Provider)
- **Response**:
  ```json
  {
    "_id": "60a8c1e2f3b4c42d1c9d2c1a",
    "customer": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1b",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "service": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1c",
      "name": "Plumbing Service",
      "description": "Complete plumbing service including pipe repair and installation",
      "price": 1500
    },
    "provider": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1d",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "date": "2023-05-25T10:00:00.000Z",
    "status": "pending",
    "totalPrice": 1500,
    "address": "123 Main St, Colombo",
    "notes": "Please arrive early",
    "customerName": "John Doe",
    "customerPhone": "+94771234567",
    "createdAt": "2023-05-22T10:30:00.000Z",
    "updatedAt": "2023-05-22T10:30:00.000Z"
  }
  ```

### Update booking status
- **Endpoint**: PUT /api/provider/bookings/:id/status
- **Description**: Update the status of a booking
- **Authentication**: Required (Provider)
- **Valid statuses**: pending, accepted, rejected, completed, cancelled
- **Request body**:
  ```json
  {
    "status": "accepted"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Booking status updated successfully",
    "booking": {
      "_id": "60a8c1e2f3b4c42d1c9d2c1a",
      "customer": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1b",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "service": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1c",
        "name": "Plumbing Service",
        "price": 1500
      },
      "provider": {
        "_id": "60a8c1e2f3b4c42d1c9d2c1d",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "date": "2023-05-25T10:00:00.000Z",
      "status": "accepted",
      "totalPrice": 1500,
      "address": "123 Main St, Colombo",
      "notes": "Please arrive early",
      "customerName": "John Doe",
      "customerPhone": "+94771234567",
      "createdAt": "2023-05-22T10:30:00.000Z",
      "updatedAt": "2023-05-22T11:45:00.000Z"
    }
  }
  ```

### Delete booking
- **Endpoint**: DELETE /api/provider/bookings/:id
- **Description**: Permanently delete a booking
- **Authentication**: Required (Provider)
- **Response**:
  ```json
  {
    "message": "Booking deleted successfully"
  }
  ```
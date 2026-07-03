# FundTrack AFRICA - API Documentation

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

All endpoints (except login) require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login

**POST** `/auth/login`

Request:
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "user@example.com",
    "role": "admin",
    "state_id": null
  }
}
```

### Register

**POST** `/auth/register`

Request:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "full_name": "New User"
}
```

Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Refresh Token

**POST** `/auth/refresh`

Response:
```json
{
  "success": true,
  "token": "new_jwt_token"
}
```

---

## Fund Endpoints

### List All Funds

**GET** `/funds`

Query Parameters:
- `fiscal_year` - Filter by fiscal year
- `status` - Filter by status (active, archived)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Education Fund 2024",
      "total_amount": 5000000.00,
      "allocated_amount": 3500000.00,
      "remaining_amount": 1500000.00,
      "source": "National Budget",
      "fiscal_year": 2024,
      "status": "active",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### Create Fund

**POST** `/funds`

Request:
```json
{
  "name": "Healthcare Fund 2024",
  "description": "Annual healthcare allocation",
  "total_amount": 3000000.00,
  "source": "National Budget",
  "fiscal_year": 2024
}
```

Response:
```json
{
  "success": true,
  "message": "Fund created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Healthcare Fund 2024",
    "total_amount": 3000000.00,
    "allocated_amount": 0,
    "remaining_amount": 3000000.00
  }
}
```

### Get Fund Details

**GET** `/funds/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Education Fund 2024",
    "description": "Annual education allocation",
    "total_amount": 5000000.00,
    "allocated_amount": 3500000.00,
    "remaining_amount": 1500000.00,
    "source": "National Budget",
    "fiscal_year": 2024,
    "status": "active",
    "allocations": [
      {
        "id": "allocation-id-1",
        "state": "Lagos",
        "amount": 500000.00,
        "status": "approved"
      }
    ]
  }
}
```

### Update Fund

**PUT** `/funds/:id`

Request:
```json
{
  "name": "Education Fund 2024 (Updated)",
  "status": "active"
}
```

### Delete Fund

**DELETE** `/funds/:id`

---

## Allocation Endpoints

### List Allocations

**GET** `/allocations`

Query Parameters:
- `fund_id` - Filter by fund
- `state_id` - Filter by state
- `status` - Filter by status (pending, approved, rejected)
- `page` - Page number
- `limit` - Items per page

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "alloc-123",
      "fund_id": "fund-123",
      "state_id": "state-456",
      "department_id": "dept-789",
      "allocated_amount": 500000.00,
      "allocation_date": "2024-01-15",
      "status": "approved",
      "approved_by": "admin-user",
      "approval_date": "2024-01-16T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120
  }
}
```

### Create Allocation

**POST** `/allocations`

Request:
```json
{
  "fund_id": "fund-123",
  "state_id": "state-456",
  "department_id": "dept-789",
  "allocated_amount": 500000.00,
  "allocation_date": "2024-01-15",
  "description": "Q1 allocation"
}
```

### Approve Allocation

**POST** `/allocations/:id/approve`

Request:
```json
{
  "approval_comment": "Approved after verification"
}
```

### Reject Allocation

**POST** `/allocations/:id/reject`

Request:
```json
{
  "rejection_reason": "Budget mismatch"
}
```

---

## Transaction Endpoints

### List Transactions

**GET** `/transactions`

Query Parameters:
- `allocation_id` - Filter by allocation
- `start_date` - Filter from date
- `end_date` - Filter to date
- `status` - Filter by status
- `page` - Page number
- `limit` - Items per page

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "txn-123",
      "allocation_id": "alloc-456",
      "amount": 100000.00,
      "transaction_date": "2024-01-20T14:30:00Z",
      "transaction_type": "disbursement",
      "description": "Monthly fund release",
      "reference_number": "REF-2024-001",
      "status": "completed"
    }
  ]
}
```

### Create Transaction

**POST** `/transactions`

Request:
```json
{
  "allocation_id": "alloc-456",
  "amount": 100000.00,
  "transaction_date": "2024-01-20",
  "transaction_type": "disbursement",
  "description": "Monthly fund release",
  "reference_number": "REF-2024-001"
}
```

---

## Resource Endpoints

### List Resources

**GET** `/resources`

Query Parameters:
- `type` - Filter by resource type
- `page` - Page number
- `limit` - Items per page

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "res-123",
      "name": "Medical Equipment",
      "type": "equipment",
      "unit_of_measure": "units",
      "total_quantity": 500,
      "allocated_quantity": 350,
      "remaining_quantity": 150,
      "status": "active"
    }
  ]
}
```

### Get Resource Locations

**GET** `/resources/:id/locations`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "loc-123",
      "resource_id": "res-123",
      "state": "Lagos",
      "quantity": 150,
      "latitude": 6.5244,
      "longitude": 3.3792,
      "warehouse_name": "Central Warehouse",
      "last_updated": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## Analytics Endpoints

### Dashboard Summary

**GET** `/analytics/dashboard`

Response:
```json
{
  "success": true,
  "data": {
    "total_funds": 50000000.00,
    "allocated_funds": 35000000.00,
    "pending_allocations": 15,
    "states_count": 36,
    "total_transactions": 2500,
    "recent_anomalies": 5,
    "fund_allocation_by_state": {
      "Lagos": 5000000,
      "Abuja": 4500000
    },
    "spending_trend": [
      {
        "month": "2024-01",
        "amount": 2500000
      }
    ]
  }
}
```

### Spending Analysis

**GET** `/analytics/spending`

Query Parameters:
- `state_id` - Filter by state
- `start_date` - Start date
- `end_date` - End date
- `group_by` - Group by (state, department, category)

Response:
```json
{
  "success": true,
  "data": {
    "total_spending": 10000000.00,
    "average_transaction": 125000.00,
    "breakdown": {
      "by_department": {
        "Education": 5000000,
        "Healthcare": 3500000,
        "Infrastructure": 1500000
      }
    }
  }
}
```

### Trend Analysis

**GET** `/analytics/trends`

Query Parameters:
- `period` - Period (daily, weekly, monthly, yearly)
- `months` - Number of months to analyze (default: 12)

Response:
```json
{
  "success": true,
  "data": {
    "trend": [
      {
        "date": "2024-01",
        "allocated": 3000000,
        "spent": 2500000,
        "variance": 500000
      }
    ],
    "forecast": [
      {
        "date": "2024-02",
        "predicted_allocation": 3100000
      }
    ]
  }
}
```

### Generate Report

**POST** `/analytics/reports`

Request:
```json
{
  "title": "Monthly Spending Report",
  "report_type": "spending",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "state_id": "state-456",
  "format": "pdf"
}
```

Response:
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "report_id": "rpt-123",
    "download_url": "/reports/downloads/rpt-123.pdf",
    "generated_at": "2024-01-31T15:00:00Z"
  }
}
```

---

## Anomaly Detection Endpoints

### List Anomalies

**GET** `/anomalies`

Query Parameters:
- `status` - Filter by status (pending_review, confirmed, false_positive)
- `severity` - Filter by severity (critical, high, medium, low)
- `page` - Page number
- `limit` - Items per page

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "anom-123",
      "transaction_id": "txn-456",
      "anomaly_type": "unusual_amount",
      "severity": "high",
      "description": "Amount significantly higher than average",
      "detected_value": 500000,
      "expected_value": 100000,
      "confidence_score": 0.95,
      "status": "pending_review",
      "created_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

### Review Anomaly

**POST** `/anomalies/:id/review`

Request:
```json
{
  "status": "confirmed",
  "comment": "Confirmed irregular transaction - requires investigation"
}
```

### Trigger Anomaly Scan

**POST** `/anomalies/scan`

Request:
```json
{
  "fund_id": "fund-123",
  "days_to_scan": 30
}
```

Response:
```json
{
  "success": true,
  "message": "Anomaly scan initiated",
  "scan_id": "scan-123"
}
```

---

## User Management Endpoints

### List Users

**GET** `/users`

Query Parameters (admin only):
- `role` - Filter by role
- `state_id` - Filter by state
- `page` - Page number
- `limit` - Items per page

### Create User (Admin)

**POST** `/users`

Request:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "full_name": "New User",
  "role": "auditor",
  "state_id": "state-123"
}
```

### Update User

**PUT** `/users/:id`

### Delete User (Admin)

**DELETE** `/users/:id`

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "User-friendly error message",
    "details": {}
  }
}
```

### Common Error Codes

- `INVALID_REQUEST` - Bad request format
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Duplicate entry
- `UNPROCESSABLE_ENTITY` - Validation error
- `INTERNAL_SERVER_ERROR` - Server error

---

## Rate Limiting

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- ML endpoints: 50 requests/minute

---

## Pagination

All list endpoints support pagination:

```
GET /endpoint?page=1&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---
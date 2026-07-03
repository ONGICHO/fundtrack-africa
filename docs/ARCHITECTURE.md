# FundTrack AFRICA - System Architecture

## Overview

FundTrack AFRICA follows a microservices architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│              React Dashboard (Port 3000)                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│            Express.js Backend (Port 5000)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Authentication & Authorization                      │   │
│  │ • Request Routing & Rate Limiting                     │   │
│  │ • Data Validation & Transformation                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Fund Service    │ │ Resource Service │ │ Analytics Service│
│  ┌────────────┐  │ │ ┌────────────┐   │ │ ┌────────────┐   │
│  │ • Track    │  │ │ │ • Allocate │   │ │ │ • Query    │   │
│  │ • Allocate │  │ │ │ • Monitor  │   │ │ │ • Report   │   │
│  │ • Report   │  │ │ │ • Locate   │   │ │ │ • Export   │   │
│  └────────────┘  │ │ └────────────┘   │ │ └────────────┘   │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│                  PostgreSQL (Port 5432)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Funds Table        • Allocations Table              │   │
│  │ • Resources Table    • Transactions Table             │   │
│  │ • States Table       • Users Table                     │   │
│  │ • Departments Table  • Audit Logs Table               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│                  ML Engine Layer                             │
│            FastAPI (Port 8000 - Python)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Anomaly Detection                                   │   │
│  │ • Predictive Analytics                                │   │
│  │ • Pattern Recognition                                 │   │
│  │ • Spending Trend Analysis                             │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓                    ↓                    ↓          │
│  ┌────────────┐        ┌────────────┐    ┌────────────┐    │
│  │ Isolation  │        │   LSTM     │    │ K-Means    │    │
│  │  Forest    │        │  Networks  │    │ Clustering │    │
│  └────────────┘        └────────────┘    └────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer (React)

**Responsibilities:**
- User interface for dashboard and analytics
- Data visualization and reporting
- User authentication
- Real-time notifications

**Key Components:**
- `DashboardPage` - Main analytics view
- `FundsTracker` - Fund allocation visualization
- `ResourceMap` - Geographic resource distribution
- `ReportsGenerator` - Custom report creation
- `AnomalyAlerts` - Real-time anomaly notifications

**Technologies:**
- React 18
- Redux for state management
- Chart.js for charts
- Mapbox GL for geographic visualization
- Axios for API calls

### 2. Backend API Layer (Express.js)

**Responsibilities:**
- Data validation and transformation
- Business logic implementation
- API endpoint management
- Authentication & authorization
- Database operations

**Key Services:**
- `FundService` - Fund tracking and allocation
- `ResourceService` - Resource localization and monitoring
- `AnalyticsService` - Data analysis and reporting
- `AnomalyService` - Anomaly detection coordination
- `AuthService` - User authentication and authorization

**Key Endpoints:**
```
Funds
  GET    /api/v1/funds                 - List all funds
  POST   /api/v1/funds                 - Create new fund
  GET    /api/v1/funds/:id             - Get fund details
  PUT    /api/v1/funds/:id             - Update fund
  DELETE /api/v1/funds/:id             - Delete fund

Allocations
  GET    /api/v1/allocations           - List allocations
  POST   /api/v1/allocations           - Create allocation
  GET    /api/v1/allocations/:id       - Get allocation details
  PUT    /api/v1/allocations/:id       - Update allocation

Resources
  GET    /api/v1/resources             - List resources
  POST   /api/v1/resources             - Create resource
  GET    /api/v1/resources/location/:id - Get by location
  PUT    /api/v1/resources/:id         - Update resource

Analytics
  GET    /api/v1/analytics/dashboard   - Dashboard data
  GET    /api/v1/analytics/spending    - Spending analysis
  GET    /api/v1/analytics/trends      - Trend analysis
  GET    /api/v1/analytics/reports     - Generate reports

Anomalies
  GET    /api/v1/anomalies             - List detected anomalies
  GET    /api/v1/anomalies/:id         - Anomaly details
  POST   /api/v1/anomalies/scan        - Trigger anomaly scan
```

### 3. Database Layer (PostgreSQL)

**Core Tables:**

```sql
-- Government entities
states (id, name, country, region, population)
departments (id, state_id, name, budget_category)

-- Financial data
funds (id, name, allocated_amount, source, fiscal_year)
allocations (id, fund_id, state_id, department_id, amount, allocated_date)
transactions (id, allocation_id, amount, date, description, status)

-- Resource management
resources (id, name, type, quantity)
resource_locations (id, resource_id, state_id, department_id, quantity, location)

-- Users & audit
users (id, username, email, role, state_id)
audit_logs (id, user_id, action, entity, entity_id, timestamp)
anomalies (id, transaction_id, anomaly_type, severity, detected_at)
```

### 4. ML Engine Layer (Python/FastAPI)

**Responsibilities:**
- Anomaly detection in spending patterns
- Predictive analytics for budget forecasting
- Pattern recognition in fund allocation
- Trend analysis and insights

**Key Algorithms:**

1. **Isolation Forest** - Detects unusual transactions
2. **LSTM Networks** - Time-series prediction for spending patterns
3. **K-Means Clustering** - Groups similar spending patterns
4. **Statistical Analysis** - Identifies outliers and trends

**Key Endpoints:**
```
/api/v1/ml/anomalies/detect        - Detect anomalies
/api/v1/ml/predictions/spending    - Predict spending
/api/v1/ml/patterns/analyze        - Analyze patterns
/api/v1/ml/clusters/compute        - Compute clusters
/api/v1/ml/train                   - Retrain models
```

## Data Flow

### Fund Tracking Flow
1. User submits fund allocation via Frontend
2. API validates and stores in Database
3. Analytics Engine processes data
4. ML Engine analyzes patterns
5. Dashboard updates with new data
6. Anomalies trigger alerts

### Anomaly Detection Flow
1. New transaction recorded in Database
2. ML Engine fetches recent data
3. Isolation Forest analyzes transaction
4. If anomaly detected, Alert Service notifies
5. Admin reviews and marks as false positive or confirmed

## Security Architecture

- **Authentication**: JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: TLS for transit, AES-256 for storage
- **Audit Logging**: All actions logged with timestamps and user info
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: All inputs validated server-side

## Deployment Architecture

```
Docker Compose (Development)
├── Database Service (PostgreSQL)
├── Backend Service (Node.js)
├── Frontend Service (React)
├── ML Engine Service (Python/FastAPI)
└── Nginx (Reverse Proxy)

Production (Cloud)
├── AWS/GCP Kubernetes Cluster
├── Managed Database Service
├── Load Balancer
├── Auto-scaling Groups
└── Monitoring & Logging (ELK Stack)
```

## Scalability Considerations

1. **Horizontal Scaling** - Multiple API instances behind load balancer
2. **Database Optimization** - Indexing, partitioning for large datasets
3. **Caching Layer** - Redis for frequently accessed data
4. **Message Queue** - RabbitMQ for async processing
5. **CDN** - CloudFront for static assets

## Monitoring & Logging

- **Application Metrics**: Prometheus
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Performance Monitoring**: New Relic or DataDog
- **Error Tracking**: Sentry

---

For detailed implementation guides, see respective service documentation.
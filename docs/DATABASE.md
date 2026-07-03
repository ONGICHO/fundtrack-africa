# FundTrack AFRICA - Database Schema

## Overview

PostgreSQL database schema for tracking government funds and resource allocation across African states.

## Core Tables

### 1. States Table

```sql
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    capital VARCHAR(255),
    population BIGINT,
    gdp DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store information about African states/provinces.

---

### 2. Departments Table

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    budget_category VARCHAR(100),
    head_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, name)
);
```

**Purpose**: Store government departments within states.

---

### 3. Funds Table

```sql
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_amount DECIMAL(15, 2) NOT NULL,
    allocated_amount DECIMAL(15, 2) DEFAULT 0,
    remaining_amount DECIMAL(15, 2),
    source VARCHAR(255) NOT NULL,
    fiscal_year INT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_amounts CHECK (allocated_amount <= total_amount)
);
```

**Purpose**: Track government funds and their allocation status.

---

### 4. Allocations Table

```sql
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    state_id UUID NOT NULL REFERENCES states(id),
    department_id UUID REFERENCES departments(id),
    allocated_amount DECIMAL(15, 2) NOT NULL,
    allocation_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT,
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_allocation CHECK (allocated_amount > 0)
);
```

**Purpose**: Track fund allocations to specific states and departments.

---

### 5. Transactions Table

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID NOT NULL REFERENCES allocations(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description TEXT,
    reference_number VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'completed',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_allocation_id ON transactions(allocation_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
```

**Purpose**: Track individual financial transactions for transparency and audit.

---

### 6. Resources Table

```sql
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    unit_of_measure VARCHAR(50),
    total_quantity DECIMAL(15, 4),
    allocated_quantity DECIMAL(15, 4) DEFAULT 0,
    remaining_quantity DECIMAL(15, 4),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store information about resources managed by government.

---

### 7. Resource Locations Table

```sql
CREATE TABLE resource_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    state_id UUID NOT NULL REFERENCES states(id),
    department_id UUID REFERENCES departments(id),
    quantity DECIMAL(15, 4) NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    address TEXT,
    warehouse_name VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resource_locations_state ON resource_locations(state_id);
CREATE INDEX idx_resource_locations_coordinates ON resource_locations(latitude, longitude);
```

**Purpose**: Track where resources are physically located.

---

### 8. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    state_id UUID REFERENCES states(id),
    department_id UUID REFERENCES departments(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state ON users(state_id);
```

**Roles**:
- `admin` - Full system access
- `state_admin` - Manage state data
- `department_head` - Manage department data
- `auditor` - View and audit data
- `viewer` - Read-only access

---

### 9. Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

**Purpose**: Complete audit trail for compliance and security.

---

### 10. Anomalies Table

```sql
CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    allocation_id UUID REFERENCES allocations(id),
    anomaly_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT,
    detected_value DECIMAL(15, 2),
    expected_value DECIMAL(15, 2),
    confidence_score DECIMAL(5, 4),
    status VARCHAR(50) DEFAULT 'pending_review',
    reviewed_by UUID REFERENCES users(id),
    review_comment TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anomalies_status ON anomalies(status);
CREATE INDEX idx_anomalies_severity ON anomalies(severity);
CREATE INDEX idx_anomalies_created ON anomalies(created_at);
```

**Severity Levels**: `critical`, `high`, `medium`, `low`

**Anomaly Types**:
- `duplicate_transaction` - Same transaction recorded multiple times
- `unusual_amount` - Amount significantly different from average
- `unusual_timing` - Transaction at unexpected time
- `unauthorized_allocation` - Allocation without proper approval
- `resource_mismatch` - Resource quantity mismatch

---

### 11. Reports Table

```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    state_id UUID REFERENCES states(id),
    department_id UUID REFERENCES departments(id),
    created_by UUID NOT NULL REFERENCES users(id),
    data_json JSONB,
    file_path VARCHAR(500),
    status VARCHAR(50) DEFAULT 'generated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_reports_creator ON reports(created_by);
CREATE INDEX idx_reports_state ON reports(state_id);
```

**Purpose**: Store generated reports for historical reference.

---

### 12. Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

**Purpose**: Send real-time alerts about anomalies and fund activities.

---

## Relationships Diagram

```
states
  ├── departments
  │   ├── allocations
  │   │   ├── transactions → anomalies
  │   │   └── resource_locations
  │   └── users
  ├── allocations
  │   ├── funds
  │   ├── transactions
  │   └── resource_locations
  └── resource_locations
      └── resources

users
  ├── audit_logs
  ├── allocations (created_by)
  ├── transactions (created_by)
  └── notifications

anomalies
  ├── transactions
  └── allocations
```

---

## Initialization Script

See `database/init.sql` for complete initialization script.

---

## Performance Considerations

1. **Indexing**: Key columns indexed for fast queries
2. **Partitioning**: Large tables partitioned by date for better performance
3. **Archiving**: Old records moved to archive tables yearly
4. **Query Optimization**: Complex queries use materialized views

---

## Backup & Recovery

- Daily backups to cloud storage
- Point-in-time recovery capability
- Regular backup testing
- Disaster recovery plan in place

---
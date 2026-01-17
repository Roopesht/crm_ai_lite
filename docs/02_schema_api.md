# AICRM Lite — MySQL Schema + API Design (MVP)

## 1) Database Schema (MySQL)

### 1.1 Table: `leads`
Stores the lead master data.

**Columns**
| Column | Type | Null | Notes |
|-------|------|------|------|
| id | BIGINT UNSIGNED | NO | PK, auto-increment |
| name | VARCHAR(150) | NO | Lead name |
| email | VARCHAR(150) | YES | Optional |
| phone | VARCHAR(30) | YES | Optional |
| status | ENUM('new','contacted','interested','qualified','lost') | NO | Default: `new` |
| source | VARCHAR(50) | YES | Example: website, referral |
| ai_summary | TEXT | YES | Optional |
| created_at | DATETIME | NO | Default: current timestamp |
| updated_at | DATETIME | NO | Auto-update on changes |

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX idx_leads_status (status)`
- `INDEX idx_leads_created_at (created_at)`
- `INDEX idx_leads_name (name)`
- `UNIQUE INDEX uq_leads_email (email)` *(optional, only if you want email uniqueness)*

---

### 1.2 Table: `interactions`
Stores interaction history per lead.

**Columns**
| Column | Type | Null | Notes |
|-------|------|------|------|
| id | BIGINT UNSIGNED | NO | PK, auto-increment |
| lead_id | BIGINT UNSIGNED | NO | FK → leads.id |
| type | ENUM('call','email','meeting','note') | NO | Interaction type |
| notes | TEXT | NO | Interaction notes |
| created_at | DATETIME | NO | Default: current timestamp |

**Constraints**
- `FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE`

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX idx_interactions_lead_id (lead_id)`
- `INDEX idx_interactions_created_at (created_at)`

---

## 2) API Design (FastAPI)

### 2.1 Leads

#### 2.1.1 Create Lead
**POST** `/api/v1/leads`

**Request Body**
- name *(required)*
- email *(optional)*
- phone *(optional)*
- status *(optional, default: new)*
- source *(optional)*
- ai_summary *(optional)*

**Response**
- 201 Created + full lead object

---

#### 2.1.2 List Leads
**GET** `/api/v1/leads`

**Query Params**
- `q` *(optional)*: search by lead name (minimum)
- `status` *(optional)*: filter by status
- `limit` *(optional, default 20)*
- `offset` *(optional, default 0)*
- `sort` *(optional, default created_at_desc)*

**Response**
- 200 OK + array of leads

---

#### 2.1.3 Get Lead Details
**GET** `/api/v1/leads/{lead_id}`

**Response**
- 200 OK + lead object
- 404 Not Found (invalid lead_id)

---

#### 2.1.4 Update Lead
**PUT** `/api/v1/leads/{lead_id}`

**Request Body**
- any updatable fields: name, email, phone, status, source, ai_summary

**Response**
- 200 OK + updated lead
- 404 Not Found

---

### 2.2 Interactions

#### 2.2.1 Add Interaction to a Lead
**POST** `/api/v1/leads/{lead_id}/interactions`

**Request Body**
- type *(required: call/email/meeting/note)*
- notes *(required)*

**Response**
- 201 Created + interaction object
- 404 Not Found (lead not found)

---

#### 2.2.2 List Interactions of a Lead
**GET** `/api/v1/leads/{lead_id}/interactions`

**Query Params**
- `limit` *(optional, default 50)*
- `offset` *(optional, default 0)*

**Response**
- 200 OK + array of interactions (latest first)
- 404 Not Found (lead not found)

---

## 3) Common API Rules

### 3.1 Status Values
Allowed lead statuses:
- `new`, `contacted`, `interested`, `qualified`, `lost`

### 3.2 Validation (Minimal)
- Lead `name` required
- Interaction `type` + `notes` required
- If `status` is provided, must match allowed values

### 3.3 Standard Errors
- `400` invalid request payload
- `404` resource not found
- `422` validation error (FastAPI default)

---
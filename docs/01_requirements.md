## Functional Requirements (MVP) — AICRM Lite

### 1) Lead Management
- Create a lead with: name (required), email, phone, status, source, ai_summary.
- View leads list with key fields: name, status, contact info, source, created_at, AI summary
- Update lead fields (including status changes).


### 2) Lead Status Tracking
- Support lead statuses: `new`, `contacted`, `interested`, `qualified`, `lost`.
- Allow updating status anytime from lead detail/edit screen.

### 3) Interaction Logging
- Add interaction for a lead with: type + notes.
- View interactions list/timeline for a lead (latest first).


### 4) Search & Filter
- Search leads by name (minimum).

### Lead structure
{
  "id": 1,
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "status": "new",  # new, contacted, qualified, lost
  "source": "website",
  "created_at": "2025-01-15",
  "ai_summary": "Tech startup, 50 employees, needs CRM"
}


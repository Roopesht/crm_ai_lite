-- 02_inserts.sql
-- AICRM Lite - Sample Insert Data

USE aicrm_lite;

-- =========================
-- Leads
-- =========================
INSERT INTO leads (name, email, phone, status, source, ai_summary)
VALUES
('Acme Corp', 'contact@acme.com', '+1-555-0123', 'new', 'website', 'Tech startup, 50 employees, needs CRM'),
('Beta Solutions', 'hello@betasolutions.com', '+91-98765-43210', 'contacted', 'referral', 'Service company exploring CRM for sales tracking'),
('Gamma Inc', NULL, '+1-222-333-4444', 'qualified', 'ad', 'Interested in CRM with interaction tracking');

-- =========================
-- Interactions
-- =========================
INSERT INTO interactions (lead_id, type, notes)
VALUES
(1, 'note', 'Lead created from website form'),
(1, 'call', 'Spoke with decision maker. Wants a demo next week.'),
(2, 'email', 'Sent intro email with product overview and pricing range.'),
(2, 'call', 'Follow-up call. Asked about onboarding and support.'),
(3, 'meeting', 'Discovery meeting completed. Confirmed requirements and timeline.');
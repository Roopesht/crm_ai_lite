-- 01_ddl.sql
-- AICRM Lite - MySQL DDL

CREATE DATABASE IF NOT EXISTS aicrm_lite;
USE aicrm_lite;

-- =========================
-- Table: leads
-- =========================
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  phone VARCHAR(30) NULL,
  status ENUM('new','contacted','interested','qualified','lost') NOT NULL DEFAULT 'new',
  source VARCHAR(50) NULL,
  ai_summary TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_leads_status (status),
  INDEX idx_leads_created_at (created_at),
  INDEX idx_leads_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional (enable only if you want email uniqueness)
-- CREATE UNIQUE INDEX uq_leads_email ON leads(email);

-- =========================
-- Table: interactions
-- =========================
CREATE TABLE IF NOT EXISTS interactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id BIGINT UNSIGNED NOT NULL,
  type ENUM('call','email','meeting','note') NOT NULL,
  notes TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_interactions_lead_id (lead_id),
  INDEX idx_interactions_created_at (created_at),
  CONSTRAINT fk_interactions_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
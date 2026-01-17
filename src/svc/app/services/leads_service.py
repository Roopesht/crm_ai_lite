from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.lead import Lead


def create_lead(db: Session, payload: dict) -> Lead:
    lead = Lead(**payload)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def list_leads(db: Session, q: str | None = None, status: str | None = None, limit: int = 20, offset: int = 0):
    query = db.query(Lead)

    if q:
        query = query.filter(Lead.name.like(f"%{q}%"))

    if status:
        query = query.filter(Lead.status == status)

    query = query.order_by(desc(Lead.created_at)).offset(offset).limit(limit)
    return query.all()


def get_lead(db: Session, lead_id: int) -> Lead | None:
    return db.query(Lead).filter(Lead.id == lead_id).first()


def update_lead(db: Session, lead: Lead, payload: dict) -> Lead:
    for k, v in payload.items():
        setattr(lead, k, v)

    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def delete_lead(db: Session, lead: Lead) -> None:
    db.delete(lead)
    db.commit()

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.interaction import Interaction


def add_interaction(db: Session, lead_id: int, payload: dict) -> Interaction:
    interaction = Interaction(lead_id=lead_id, **payload)
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


def list_interactions(db: Session, lead_id: int, limit: int = 50, offset: int = 0):
    return (
        db.query(Interaction)
        .filter(Interaction.lead_id == lead_id)
        .order_by(desc(Interaction.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

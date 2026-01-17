from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.lead import Lead
from app.models.interaction import Interaction


def suggest_message(db: Session, lead_id: int, interaction_type: str, notes: str | None):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        return None

    past = (
        db.query(Interaction)
        .filter(Interaction.lead_id == lead_id)
        .order_by(desc(Interaction.created_at))
        .limit(5)
        .all()
    )

    last_hint = past[0].notes if past else None

    # MVP suggestion logic (simple template)
    name = lead.name or "there"
    status = lead.status

    base = f"Hi {name}, "
    if status in ("new", "contacted"):
        base += "thanks for your time. "
    elif status in ("interested", "qualified"):
        base += "great speaking with you. "

    if interaction_type == "email":
        base += "Sharing the details as discussed. "
    elif interaction_type == "call":
        base += "Following up on our call. "
    elif interaction_type == "meeting":
        base += "Thanks for meeting today. "
    else:
        base += ""

    if notes:
        base += f"Context: {notes.strip()} "

    if last_hint and not notes:
        base += f"Based on last update: {last_hint.strip()} "

    base += "Please let me know the best next step from your side."

    return {
        "suggested_message": base.strip(),
        "context_used": {"lead_id": lead_id, "interaction_count": len(past)},
    }

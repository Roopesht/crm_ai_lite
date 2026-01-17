from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.interactions import InteractionCreate, InteractionOut
from app.services import interactions_service

router = APIRouter()


@router.get("", response_model=list[InteractionOut])
def list_interactions(
    lead_id: int | None = None,
    db: Session = Depends(get_db)
):
    """List all interactions for a lead."""
    if not lead_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="lead_id is required"
        )
    return interactions_service.list_interactions(db=db, lead_id=lead_id)


@router.get("/{interaction_id}", response_model=InteractionOut)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    """Get a specific interaction by ID."""
    interaction = interactions_service.get_interaction(db=db, interaction_id=interaction_id)
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found"
        )
    return interaction


@router.post("", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def create_interaction(
    data: InteractionCreate,
    lead_id: int | None = None,
    db: Session = Depends(get_db)
):
    """Create a new interaction for a lead."""
    if not lead_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="lead_id is required"
        )
    return interactions_service.add_interaction(
        db=db, lead_id=lead_id, payload=data.model_dump()
    )


@router.put("/{interaction_id}", response_model=InteractionOut)
def update_interaction(
    interaction_id: int, data: InteractionCreate, db: Session = Depends(get_db)
):
    """Update an existing interaction."""
    interaction = interactions_service.get_interaction(db=db, interaction_id=interaction_id)
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found"
        )

    update_payload = {k: v for k, v in data.model_dump().items() if v is not None}
    return interactions_service.update_interaction(
        db=db, interaction=interaction, payload=update_payload
    )


@router.delete("/{interaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    """Delete an interaction."""
    interaction = interactions_service.get_interaction(db=db, interaction_id=interaction_id)
    if not interaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found"
        )

    interactions_service.delete_interaction(db=db, interaction=interaction)

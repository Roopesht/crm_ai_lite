from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.routes.lead_query_params import LeadQueryParams
from app.db.deps import get_db
from app.schemas.leads import LeadCreate, LeadOut, LeadUpdate
from app.services import leads_service

router = APIRouter()


@router.get("", response_model=list[LeadOut])
def list_leads(
    params: LeadQueryParams = Depends(), db: Session = Depends(get_db)
):
    """List all leads with optional filtering."""
    return leads_service.list_leads(
        db=db, q=params.q, status=params.status, limit=params.limit, offset=params.offset
    )


@router.get("/{lead_id}", response_model=LeadOut)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get a specific lead by ID."""
    lead = leads_service.get_lead(db=db, lead_id=lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found"
        )
    return lead


@router.post("", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    """Create a new lead."""
    return leads_service.create_lead(db=db, payload=lead.model_dump())


@router.put("/{lead_id}", response_model=LeadOut)
def update_lead(
    lead_id: int, lead_data: LeadUpdate, db: Session = Depends(get_db)
):
    """Update an existing lead."""
    lead = leads_service.get_lead(db=db, lead_id=lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found"
        )

    # Filter out None values from the update payload
    update_payload = {k: v for k, v in lead_data.model_dump().items() if v is not None}

    return leads_service.update_lead(db=db, lead=lead, payload=update_payload)


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """Delete a lead."""
    lead = leads_service.get_lead(db=db, lead_id=lead_id)
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found"
        )

    leads_service.delete_lead(db=db, lead=lead)

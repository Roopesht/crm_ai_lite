from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field


LeadStatus = Literal["new", "contacted", "interested", "qualified", "lost"]


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[LeadStatus] = "new"
    source: Optional[str] = None
    ai_summary: Optional[str] = None
    next_contact_date: Optional[datetime] = None


class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[LeadStatus] = None
    source: Optional[str] = None
    ai_summary: Optional[str] = None
    next_contact_date: Optional[datetime] = None


class LeadOut(BaseModel):
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    status: LeadStatus
    source: Optional[str]
    ai_summary: Optional[str]
    next_contact_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

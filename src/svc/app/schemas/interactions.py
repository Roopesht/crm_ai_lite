from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


InteractionType = Literal["call", "email", "meeting", "note"]


class InteractionCreate(BaseModel):
    type: InteractionType
    notes: str = Field(..., min_length=1)


class InteractionOut(BaseModel):
    id: int
    lead_id: int
    type: InteractionType
    notes: str
    created_at: datetime

    class Config:
        from_attributes = True


class SuggestRequest(BaseModel):
    type: InteractionType
    notes: str | None = None


class SuggestResponse(BaseModel):
    suggested_message: str
    context_used: dict | None = None

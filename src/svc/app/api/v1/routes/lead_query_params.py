from typing import Optional

from pydantic import BaseModel, Field


class LeadQueryParams(BaseModel):
    q: Optional[str] = Field(None, description="Search query for lead name")
    status: Optional[str] = Field(None, description="Filter by lead status")
    limit: int = Field(20, ge=1, le=100, description="Number of results to return")
    offset: int = Field(0, ge=0, description="Number of results to skip")

#!/usr/bin/env bash
set -e

# ============================================
# AICRM Lite - FastAPI Service Scaffold
# Root folder: svc
# ============================================

ROOT="svc"

echo "Creating FastAPI service in: $ROOT"

mkdir -p "$ROOT/app/api/v1"
mkdir -p "$ROOT/app/core"
mkdir -p "$ROOT/app/db"
mkdir -p "$ROOT/app/models"
mkdir -p "$ROOT/app/schemas"
mkdir -p "$ROOT/app/services"
mkdir -p "$ROOT/app/utils"

mkdir -p "$ROOT/tests"

# -----------------------------
# requirements.txt
# -----------------------------
cat > "$ROOT/requirements.txt" << 'EOF'
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
pymysql==1.1.1
python-dotenv==1.0.1
pydantic==2.9.2
pydantic-settings==2.5.2
EOF

# -----------------------------
# .env.example
# -----------------------------
cat > "$ROOT/.env.example" << 'EOF'
APP_NAME=AICRM Lite
APP_ENV=dev
APP_HOST=0.0.0.0
APP_PORT=8000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=aicrm_lite
DB_USER=root
DB_PASSWORD=your_password
EOF

# -----------------------------
# README.md
# -----------------------------
cat > "$ROOT/README.md" << 'EOF'
# AICRM Lite - Service (FastAPI)

## Run (local)
1. Create venv and install deps
   - python -m venv .venv
   - source .venv/bin/activate
   - pip install -r requirements.txt

2. Setup env
   - cp .env.example .env

3. Start server
   - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## API Base
- http://localhost:8000
- Swagger: /docs
EOF

# -----------------------------
# app/__init__.py
# -----------------------------
cat > "$ROOT/app/__init__.py" << 'EOF'
EOF

# -----------------------------
# app/main.py
# -----------------------------
cat > "$ROOT/app/main.py" << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.api.v1.router import api_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
EOF

# -----------------------------
# app/core/settings.py
# -----------------------------
cat > "$ROOT/app/core/settings.py" << 'EOF'
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AICRM Lite"
    APP_ENV: str = "dev"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "aicrm_lite"
    DB_USER: str = "root"
    DB_PASSWORD: str = "password"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
EOF

# -----------------------------
# app/db/session.py
# -----------------------------
cat > "$ROOT/app/db/session.py" << 'EOF'
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.settings import settings

DATABASE_URL = (
    f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
EOF

# -----------------------------
# app/db/deps.py
# -----------------------------
cat > "$ROOT/app/db/deps.py" << 'EOF'
from app.db.session import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
EOF

# -----------------------------
# app/models/__init__.py
# -----------------------------
cat > "$ROOT/app/models/__init__.py" << 'EOF'
from app.models.lead import Lead
from app.models.interaction import Interaction
EOF

# -----------------------------
# app/models/lead.py
# -----------------------------
cat > "$ROOT/app/models/lead.py" << 'EOF'
from sqlalchemy import Column, BigInteger, DateTime, Enum, String, Text, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Lead(Base):
    __tablename__ = "leads"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)

    status = Column(
        Enum("new", "contacted", "interested", "qualified", "lost"),
        nullable=False,
        default="new",
    )

    source = Column(String(50), nullable=True)
    ai_summary = Column(Text, nullable=True)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
EOF

# -----------------------------
# app/models/interaction.py
# -----------------------------
cat > "$ROOT/app/models/interaction.py" << 'EOF'
from sqlalchemy import Column, BigInteger, DateTime, Enum, ForeignKey, Text, func
from sqlalchemy.orm import relationship

from app.models.lead import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(BigInteger, primary_key=True, index=True)
    lead_id = Column(BigInteger, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)

    type = Column(Enum("call", "email", "meeting", "note"), nullable=False)
    notes = Column(Text, nullable=False)

    created_at = Column(DateTime, nullable=False, server_default=func.now())

    lead = relationship("Lead", backref="interactions")
EOF

# -----------------------------
# app/schemas/leads.py
# -----------------------------
cat > "$ROOT/app/schemas/leads.py" << 'EOF'
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


class LeadUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[LeadStatus] = None
    source: Optional[str] = None
    ai_summary: Optional[str] = None


class LeadOut(BaseModel):
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    status: LeadStatus
    source: Optional[str]
    ai_summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
EOF

# -----------------------------
# app/schemas/interactions.py
# -----------------------------
cat > "$ROOT/app/schemas/interactions.py" << 'EOF'
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
EOF

# -----------------------------
# app/services/leads_service.py
# -----------------------------
cat > "$ROOT/app/services/leads_service.py" << 'EOF'
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
EOF

# -----------------------------
# app/services/interactions_service.py
# -----------------------------
cat > "$ROOT/app/services/interactions_service.py" << 'EOF'
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
EOF

# -----------------------------
# app/services/suggest_service.py
# -----------------------------
cat > "$ROOT/app/services/suggest_service.py" << 'EOF'
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
EOF

# -----------------------------
# app/api/v1/router.py
# -----------------------------
cat > "$ROOT/app/api/v1/router.py" << 'EOF'
from fastapi import APIRouter

from app.api.v1.routes.leads import router as leads_router
from app.api.v1.routes.interactions import router as interactions_router

api_router = APIRouter()
api_router.include_router(leads_router, tags=["Leads"])
api_router.include_router(interactions_router, tags=["Interactions"])
EOF

# -----------------------------
# app/api/v1/routes/leads.py
# -----------------------------
cat > "$ROOT/app/api/v1/routes/leads.py" << 'EOF'
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.leads import LeadCreate, LeadOut, LeadUpdate
from app.services.leads_service import create_lead, get_lead, list_leads, update_lead

router = APIRouter(prefix="/leads")


@router.post("", response_model=LeadOut)
def create(payload: LeadCreate, db: Session = Depends(get_db)):
    return create_lead(db, payload.model_dump())


@router.get("", response_model=list[LeadOut])
def list_all(
    q: str | None = None,
    status: str | None = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    return list_leads(db, q=q, status=status, limit=limit, offset=offset)


@router.get("/{lead_id}", response_model=LeadOut)
def get_one(lead_id: int, db: Session = Depends(get_db)):
    lead = get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadOut)
def update_one(lead_id: int, payload: LeadUpdate, db: Session = Depends(get_db)):
    lead = get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return update_lead(db, lead, payload.model_dump(exclude_unset=True))
EOF

# -----------------------------
# app/api/v1/routes/interactions.py
# -----------------------------
cat > "$ROOT/app/api/v1/routes/interactions.py" << 'EOF'
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.interactions import InteractionCreate, InteractionOut, SuggestRequest, SuggestResponse
from app.services.leads_service import get_lead
from app.services.interactions_service import add_interaction, list_interactions
from app.services.suggest_service import suggest_message

router = APIRouter(prefix="/leads")


@router.post("/{lead_id}/interactions", response_model=InteractionOut)
def create_interaction(lead_id: int, payload: InteractionCreate, db: Session = Depends(get_db)):
    lead = get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return add_interaction(db, lead_id, payload.model_dump())


@router.get("/{lead_id}/interactions", response_model=list[InteractionOut])
def get_interactions(lead_id: int, limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    lead = get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return list_interactions(db, lead_id, limit=limit, offset=offset)


@router.post("/{lead_id}/interactions/suggest", response_model=SuggestResponse)
def suggest(lead_id: int, payload: SuggestRequest, db: Session = Depends(get_db)):
    result = suggest_message(db, lead_id, payload.type, payload.notes)
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return result
EOF

echo "Done. Service created in ./svc"
echo ""
echo "Next:"
echo "1) cd svc"
echo "2) cp .env.example .env  (update DB creds)"
echo "3) pip install -r requirements.txt"
echo "4) uvicorn app.main:app --reload --port 8000"
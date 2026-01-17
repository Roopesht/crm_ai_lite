from fastapi import APIRouter

from app.api.v1.routes.leads import router as leads_router
from app.api.v1.routes.interactions import router as interactions_router

api_router = APIRouter()
api_router.include_router(leads_router, prefix="/leads", tags=["Leads"])
api_router.include_router(
    interactions_router,
    prefix="/interactions",
    tags=["Interactions"]
)
# Also include interactions under leads for nested resource access
api_router.include_router(
    interactions_router,
    prefix="/leads/{lead_id}/interactions",
    tags=["Interactions"]
)

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

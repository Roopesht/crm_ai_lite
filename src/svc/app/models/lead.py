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
    next_contact_date = Column(DateTime, nullable=True)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

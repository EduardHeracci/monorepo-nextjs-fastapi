from typing import Optional
import uuid
from sqlmodel import SQLModel, Field


class HeroBase(SQLModel):
    name: str
    age: Optional[int] = None
    secret_name: str


class Hero(HeroBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)


class HeroUpdate(HeroBase):
    name: Optional[str] = None  # type: ignore
    age: Optional[int] = None
    secret_name: Optional[str] = None  # type: ignore


class HeroPublic(HeroBase):
    id: str

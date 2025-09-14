from contextlib import asynccontextmanager
from typing import Annotated, Union
from .db.models import Hero, HeroBase, HeroPublic, HeroUpdate
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Session, select
from .core.database import create_db_and_tables, get_session

SessionDep = Annotated[Session, Depends(get_session)]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create database tables
    create_db_and_tables()
    yield
    # Shutdown: (optional cleanup if needed)


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None) -> dict[str, Union[str, int, None]]:
    return {"item_id": item_id, "q": q}


@app.get("/heroes/")
def read_heroes(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes  # type: ignore


# Code above omitted 👆


@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


# Code below omitted 👇


@app.post("/heroes/", response_model=Hero)
def create_hero(hero_input: HeroBase, session: SessionDep) -> Hero:
    hero = Hero(**hero_input.model_dump())  # id is auto-generated
    session.add(hero)
    session.commit()
    session.refresh(hero)
    return hero


@app.patch("/heroes/{hero_id}", response_model=Hero)
def patch_hero(hero_id: int, hero_update: HeroUpdate, session: SessionDep) -> Hero:
    db_hero = session.get(Hero, hero_id)
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero not found")

    update_data = hero_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_hero, key, value)

    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero


@app.delete("/heroes/{hero_id}", status_code=204)
def delete_hero(hero_id: str, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return

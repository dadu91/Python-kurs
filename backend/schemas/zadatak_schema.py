from pydantic import BaseModel
from typing import Optional


class ZadatakOut(BaseModel):
    id: int
    lekcija_id: int
    redoslijed: int
    tezina: str
    tip: str

    class Config:
        from_attributes = True


class ZadatakCreate(BaseModel):
    lekcija_id: int
    tezina: Optional[str] = "laka"
    tip: Optional[str] = "teorija"


class ZadatakUpdate(BaseModel):
    tezina: Optional[str] = None
    tip: Optional[str] = None

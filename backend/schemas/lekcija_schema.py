from pydantic import BaseModel


class LekcijaBase(BaseModel):
    naziv: str
    redoslijed: int
    opis: str | None = None


class LekcijaCreate(LekcijaBase):
    pass


class LekcijaUpdate(BaseModel):
    naziv: str | None = None
    redoslijed: int | None = None
    opis: str | None = None


class LekcijaOut(LekcijaBase):
    id: int

    class Config:
        from_attributes = True
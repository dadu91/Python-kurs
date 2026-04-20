from pydantic import BaseModel


class LekcijaBase(BaseModel):
    naziv: str
    redosljed: int
    opis: str | None = None


class LekcijaOut(LekcijaBase):
    id: int

    class Config:
        from_attributes = True
from pydantic import BaseModel


class LekcijaBase(BaseModel):
    naziv: str
    redoslijed: int
    opis: str | None = None
    ciljevi: str | None = None
    primjer_koda: str | None = None
    objasnjenje_koda: str | None = None
    trajanje: str | None = None
    nivo: str | None = None
    sadrzaj: str | None = None


class LekcijaCreate(LekcijaBase):
    pass


class LekcijaUpdate(BaseModel):
    naziv: str | None = None
    redoslijed: int | None = None
    opis: str | None = None
    ciljevi: str | None = None
    primjer_koda: str | None = None
    objasnjenje_koda: str | None = None
    trajanje: str | None = None
    nivo: str | None = None
    sadrzaj: str | None = None


class LekcijaOut(LekcijaBase):
    id: int

    class Config:
        from_attributes = True
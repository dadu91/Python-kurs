from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas.lekcija_schema import LekcijaOut
from backend.services.lekcija_service import procitaj_sve_lekcije

router = APIRouter(prefix="/lekcije", tags=["Lekcije"])


@router.get("/", response_model=list[LekcijaOut])
def vrati_lekcije(db: Session = Depends(get_db)):
    return procitaj_sve_lekcije(db)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.lekcija_schema import LekcijaOut
from services.lekcija_service import procitaj_sve_lekcije

router = APIRouter(prefix="/lekcije", tags=["Lekcije"])


@router.get("/", response_model=list[LekcijaOut])
def vrati_lekcije(db: Session = Depends(get_db)):
    return procitaj_sve_lekcije(db)
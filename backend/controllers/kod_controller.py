from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services import kod_service
from schemas.kod_schema import KodIzvrsavanjeCreate, KodIzvrsavanjeOut
from utils.auth import get_current_user
from models.korisnik import Korisnik

router = APIRouter(prefix="/kod", tags=["Kod izvrsavanje"])


@router.post("/execute", response_model=KodIzvrsavanjeOut)
def izvrsi_kod(
    zahtjev: KodIzvrsavanjeCreate,
    db: Session = Depends(get_db),
    current_user: Korisnik = Depends(get_current_user),
):
    return kod_service.izvrsi_kod(zahtjev.kod)
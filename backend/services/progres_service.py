from sqlalchemy.orm import Session
from repositories import progres_repository
from fastapi import HTTPException, status
from models.progres import Progres
from schemas.progres_schema import ProgresCreate

# GET
def get_progres_id(db: Session, progres_id: int):
    progres = progres_repository.get_progres_by_id(db, progres_id)
    if not progres:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progres sa ID-em {progres_id} nije pronadjen"
        )
    return progres

def get_progres_korisnik_id(db: Session, korisnik_id: int):
    progres = progres_repository.get_progres_by_korisnik_id(db, korisnik_id)
    if not progres:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Progres sa ID-em korisnika {korisnik_id} nije pronadjen"
        )
    return progres

# POST
def create_progres(db: Session, data: ProgresCreate):
    postojeci = progres_repository.get_progres_by_korisnik_id(db, data.korisnik_id)
    if postojeci:
        return postojeci
    novi = Progres(korisnik_id=data.korisnik_id, nivo=1, bodovi=0)
    return progres_repository.create_progres(db, novi)

# PUT
def update_progres(db: Session, progres: Progres):
    '''
    TODO: ovdje ide logika bodovanja, znaci kad smislimo kako levelup-ovanje ide i bodovanje od zadataka i lekcija, ovu funkciju pozivamo u poljima koja uticu na bodovanje!
    '''
    return progres_repository.update_progres(db, progres)
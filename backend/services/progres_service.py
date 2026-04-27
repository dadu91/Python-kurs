from sqlalchemy.orm import Session
from repositories import progres_repository
from fastapi import HTTPException, status
from models.progres import Progres

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

# PUT
def update_progres(db: Session, progres: Progres):
    '''
    TODO: ovdje ide logika bodovanja, znaci kad smislimo kako levelup-ovanje ide i bodovanje od zadataka i lekcija, ovu funkciju pozivamo u poljima koja uticu na bodovanje!
    '''
    return progres_repository.update_progres(db, progres)
from sqlalchemy.orm import Session
from repositories import zavrsena_lekcija_repository
from fastapi import HTTPException, status
from models.zavrsena_lekcija import ZavrsenaLekcija

# GET
def get_zavrsena_lekcija_all(db: Session):
    return zavrsena_lekcija_repository.get_all_zavrsena_lekcija(db)

def get_zavrsena_lekcija_id(db: Session, id: int):
    zavrsena_lekcija = zavrsena_lekcija_repository.get_zavrsena_lekcija_by_id(db, id)
    if not zavrsena_lekcija:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zavrsena lekcija sa ID-em {id} nije pronadjena."
        )
    return zavrsena_lekcija

def get_zavrsena_lekcija_korisnik_id(db: Session, korisnik_id: int):
    zavrsena_lekcija = zavrsena_lekcija_repository.get_zavrsena_lekcija_by_korisnik_id(db, korisnik_id)
    if not zavrsena_lekcija:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zavrsena lekcija sa korisnik ID-em {korisnik_id} nije pronadjena."
        )
    return zavrsena_lekcija

def get_zavrsena_lekcija_lekcija_id(db: Session, lekcija_id: int):
    zavrsena_lekcija = zavrsena_lekcija_repository.get_zavrsena_lekcija_by_lekcija_id(db, lekcija_id)
    if not zavrsena_lekcija:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zavrsena lekcija sa lekcija ID-em {lekcija_id} nije pronadjena."
        )
    return zavrsena_lekcija

# POST
from schemas.zavrsena_lekcija_schema import ZavrsenaLekcijaCreate

def create_zavrsena_lekcija(db: Session, zavrsena_lekcija: ZavrsenaLekcijaCreate):
    zavrsena_lekcija_lekcija_id = zavrsena_lekcija_repository.get_zavrsena_lekcija_by_lekcija_id(db, zavrsena_lekcija.lekcija_id)
    zavrsena_lekcija_korisnik_id = zavrsena_lekcija_repository.get_zavrsena_lekcija_by_korisnik_id(db, zavrsena_lekcija.korisnik_id)
    if zavrsena_lekcija_lekcija_id and zavrsena_lekcija_korisnik_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Vec postoji zavrsena lekcija sa lekcija ID-em {zavrsena_lekcija.lekcija_id} i sa korisnik ID-em {zavrsena_lekcija.korisnik_id}."
        )
    
    nova_zavrsena_lekcija = ZavrsenaLekcija(
        korisnik_id = zavrsena_lekcija.korisnik_id,
        lekcija_id = zavrsena_lekcija.lekcija_id
    )

    return zavrsena_lekcija_repository.create_zavrsena_lekcija(db, nova_zavrsena_lekcija)
from sqlalchemy.orm import Session
from repositories import zadatak_korisnik_repository
from fastapi import HTTPException, status
from models.zadatak_korisnik import ZadatakKorisnik

# GET
def get_zadatak_korisnik_id(db: Session, id: int):
    zadatak_korisnik = zadatak_korisnik_repository.get_zadatak_korisnik_by_id(db, id)
    if not zadatak_korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik nije uradio zadatak sa ID-em {id}."
        ) 
    return zadatak_korisnik

def get_zadatak_korisnik_zadatak_id(db: Session, zadatak_id: int):
    zadatak_korisnik = zadatak_korisnik_repository.get_zadatak_korisnik_by_zadatak_id(db, zadatak_id)
    if not zadatak_korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik nije uradio zadatak sa zadatak ID-em {zadatak_id}."
        ) 
    return zadatak_korisnik

def get_zadatak_korisnik_korisnik_id(db: Session, korisnik_id: int):
    zadatak_korisnik = zadatak_korisnik_repository.get_zadatak_korisnik_by_korisnik_id(db, korisnik_id)
    if not zadatak_korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik nije uradio zadatak sa korisnik ID-em {korisnik_id}."
        ) 
    return zadatak_korisnik

def get_zadatak_korisnik_greska_id(db: Session, greska_id: int):
    zadatak_korisnik = zadatak_korisnik_repository.get_zadatak_korisnik_by_greska_id(db, greska_id)
    if not zadatak_korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik nije uradio zadatak sa greska ID-em {greska_id}."
        ) 
    return zadatak_korisnik

def get_zadatak_korisnik_tacno(db: Session, tacno: bool):
    zadatak_korisnik = zadatak_korisnik_repository.get_zadatak_korisnik_by_tacno(db, tacno)
    if not zadatak_korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik nije uradio zadatak sa zadatak tacnoscu: {tacno}."
        ) 
    return zadatak_korisnik

# POST
from schemas.zadatak_korisnik_schema import ZadatakKorisnikCreate

def create_zadatak_korisnik(db: Session, zadatak_korisnik: ZadatakKorisnikCreate):
    #provjera nije potrebna zato sto korisnik moze da iz vise pokusaja radi zadatak
    novi_zadatak_korisnik = ZadatakKorisnik(
        zadatak_id = zadatak_korisnik.zadatak_id,
        korisnik_id = zadatak_korisnik.korisnik_id,
        greska_id = zadatak_korisnik.greska_id,
        tacno = zadatak_korisnik.tacno
    )
    
    return zadatak_korisnik_repository.create_zadatak_korisnik(db, novi_zadatak_korisnik)
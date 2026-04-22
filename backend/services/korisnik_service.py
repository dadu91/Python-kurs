from sqlalchemy.orm import Session
from repositories import korisnik_repository
from fastapi import HTTPException, status
from models.korisnik import Korisnik

def get_korisnik_all(db: Session):
    return db.query(Korisnik).all()

def get_korisnik_id(db: Session, user_id: int):
    korisnik = korisnik_repository.get_user_by_id(db, user_id)
    if not korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik sa ID-em {user_id} nije pronađen."
        )
    return korisnik

def get_korisnik_username(db: Session, username: str):
    korisnik = korisnik_repository.get_user_by_username(db, username)
    if not korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik sa username-om {username} nije pronađen."
        )
    return korisnik

def get_korisnik_mail(db: Session, mail: str):
    korisnik = korisnik_repository.get_user_by_mail(db, mail)
    if not korisnik:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Korisnik sa mail-om {mail} nije pronađen."
        )
    return korisnik


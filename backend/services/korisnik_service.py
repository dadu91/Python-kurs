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


# POST
from utils import security
from schemas.korisnik_schema import KorisnikCreate

def create_korisnik(db: Session, korisnik: KorisnikCreate):
    if not security.validiraj_sifru(korisnik.password):
       raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Šifra mora imati veliko slovo, broj, specijalni znak i minimum 8 karaktera."
        )
    
    if korisnik_repository.get_user_by_username(db, korisnik.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ovaj username je zauzet!"
        )
    
    if korisnik_repository.get_user_by_mail(db, korisnik.mail):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Korisnik sa ovim mail-om vec postoji!"
        )
    
    korisnik.password = security.hash_password(korisnik.password)

    
    novi_korisnik = Korisnik(
        username = korisnik.username,
        mail = korisnik.mail,
        password = korisnik.password
    )

    korisnik_ret = korisnik_repository.create_user(db, novi_korisnik)
    return korisnik_ret

# PUT
from schemas.korisnik_schema import KornisnikUpdate

def update_korisnik(db: Session, korisnik: Korisnik, korisnik_update: KornisnikUpdate):
    if korisnik_update.username is not None:
        korisnik.username = korisnik_update.username
    if korisnik_update.mail is not None:
        korisnik.mail = korisnik_update.mail
    if korisnik_update.password is not None:
        if not security.validiraj_sifru(korisnik_update.password):
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Šifra mora imati veliko slovo, broj, specijalni znak i minimum 8 karaktera."
                )
        else:
            korisnik.password = security.hash_password(korisnik_update.password)

    return korisnik_repository.update_user(db, korisnik)
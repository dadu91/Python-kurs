from sqlalchemy.orm import Session
from models.zadatak_korisnik import ZadatakKorisnik

# GET
def get_zadatak_korisnik_by_id(db: Session, id: int):
    return db.query(ZadatakKorisnik).filter(ZadatakKorisnik.id == id).first()

def get_zadatak_korisnik_by_zadatak_id(db: Session, zadatak_id: int):
    return db.query(ZadatakKorisnik).filter(ZadatakKorisnik.zadatak_id == zadatak_id).first()

def get_zadatak_korisnik_by_korisnik_id(db: Session, korisnik_id: int):
    return db.query(ZadatakKorisnik).filter(ZadatakKorisnik.korisnik_id == korisnik_id).first()

def get_zadatak_korisnik_by_greska_id(db: Session, greska_id: int):
    return db.query(ZadatakKorisnik).filter(ZadatakKorisnik.greska_id == greska_id).first()

def get_zadatak_korisnik_by_tacno(db: Session, tacno: bool):
    return db.query(ZadatakKorisnik).filter(ZadatakKorisnik.tacno == tacno).all()

# POST
def create_zadatak_korisnik(db: Session, zadatak_korisnik: ZadatakKorisnik):
    db.add(zadatak_korisnik)
    db.commit()
    db.refresh(zadatak_korisnik)
    return zadatak_korisnik
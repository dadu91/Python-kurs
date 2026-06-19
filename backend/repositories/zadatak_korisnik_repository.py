from sqlalchemy.orm import Session
from models.zadatak_korisnik import ZadatakKorisnik
from models.greska import Greska
from models.zadatak import Zadatak
from models.lekcija import Lekcija

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

def get_tacno_by_korisnik_and_zadatak(db: Session, korisnik_id: int, zadatak_id: int):
    return db.query(ZadatakKorisnik).filter(
        ZadatakKorisnik.korisnik_id == korisnik_id,
        ZadatakKorisnik.zadatak_id == zadatak_id,
        ZadatakKorisnik.tacno == True
    ).first()

def get_tacni_zadaci_by_korisnik(db: Session, korisnik_id: int):
    return db.query(ZadatakKorisnik).filter(
        ZadatakKorisnik.korisnik_id == korisnik_id,
        ZadatakKorisnik.tacno == True
    ).all()

def get_greske_by_korisnik(db: Session, korisnik_id: int):
    return (
        db.query(ZadatakKorisnik, Greska, Zadatak, Lekcija)
        .join(Greska, ZadatakKorisnik.greska_id == Greska.id)
        .join(Zadatak, ZadatakKorisnik.zadatak_id == Zadatak.id)
        .join(Lekcija, Zadatak.lekcija_id == Lekcija.id)
        .filter(ZadatakKorisnik.korisnik_id == korisnik_id)
        .order_by(ZadatakKorisnik.datum.desc())
        .all()
    )

# POST
def create_zadatak_korisnik(db: Session, zadatak_korisnik: ZadatakKorisnik):
    db.add(zadatak_korisnik)
    db.commit()
    db.refresh(zadatak_korisnik)
    return zadatak_korisnik
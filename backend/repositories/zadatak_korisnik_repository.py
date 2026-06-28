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

def get_aktivnost_sedmica(db: Session, korisnik_id: int):
    from datetime import datetime, timedelta
    from sqlalchemy import func, cast, Date
    sedam_dana = datetime.now() - timedelta(days=6)
    return (
        db.query(
            cast(ZadatakKorisnik.datum, Date).label("dan"),
            func.count(ZadatakKorisnik.id).label("broj")
        )
        .filter(ZadatakKorisnik.korisnik_id == korisnik_id, ZadatakKorisnik.datum >= sedam_dana)
        .group_by(cast(ZadatakKorisnik.datum, Date))
        .all()
    )

def get_netacni_zadaci_by_korisnik(db: Session, korisnik_id: int):
    return db.query(ZadatakKorisnik).filter(
        ZadatakKorisnik.korisnik_id == korisnik_id,
        ZadatakKorisnik.tacno == False
    ).all()

def get_netacni_detalji(db: Session, korisnik_id: int):
    from sqlalchemy import func
    return (
        db.query(
            ZadatakKorisnik.id.label("id"),
            ZadatakKorisnik.datum.label("datum"),
            Zadatak.naziv.label("zadatak_naziv"),
            Zadatak.tip.label("zadatak_tip"),
            Zadatak.redoslijed.label("zadatak_redoslijed"),
            Lekcija.id.label("lekcija_id"),
            Lekcija.naziv.label("lekcija_naziv"),
        )
        .join(Zadatak, ZadatakKorisnik.zadatak_id == Zadatak.id)
        .join(Lekcija, Zadatak.lekcija_id == Lekcija.id)
        .filter(ZadatakKorisnik.korisnik_id == korisnik_id, ZadatakKorisnik.tacno == False)
        .order_by(ZadatakKorisnik.datum.desc())
        .all()
    )

def get_netacni_by_lekcija(db: Session, korisnik_id: int):
    from sqlalchemy import func
    return (
        db.query(
            Lekcija.naziv.label("lekcija_naziv"),
            func.count(ZadatakKorisnik.id).label("broj")
        )
        .join(Zadatak, ZadatakKorisnik.zadatak_id == Zadatak.id)
        .join(Lekcija, Zadatak.lekcija_id == Lekcija.id)
        .filter(ZadatakKorisnik.korisnik_id == korisnik_id, ZadatakKorisnik.tacno == False)
        .group_by(Lekcija.naziv)
        .order_by(func.count(ZadatakKorisnik.id).desc())
        .all()
    )

# DELETE
def delete_netacni_by_korisnik_zadatak(db: Session, korisnik_id: int, zadatak_id: int):
    db.query(ZadatakKorisnik).filter(
        ZadatakKorisnik.korisnik_id == korisnik_id,
        ZadatakKorisnik.zadatak_id == zadatak_id,
        ZadatakKorisnik.tacno == False
    ).delete()
    db.commit()

# POST
def create_zadatak_korisnik(db: Session, zadatak_korisnik: ZadatakKorisnik):
    db.add(zadatak_korisnik)
    db.commit()
    db.refresh(zadatak_korisnik)
    return zadatak_korisnik
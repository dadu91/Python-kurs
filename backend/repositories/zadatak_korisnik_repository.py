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

def get_greske_by_korisnik(db: Session, korisnik_id: int):
    from sqlalchemy import func
    from models.greska import Greska
    return (
        db.query(
            Greska.tip_greske.label("tip_greske"),
            Greska.opis.label("opis"),
            func.count(ZadatakKorisnik.id).label("broj"),
            func.max(ZadatakKorisnik.datum).label("zadnji_put"),
        )
        .join(Greska, ZadatakKorisnik.greska_id == Greska.id)
        .filter(ZadatakKorisnik.korisnik_id == korisnik_id, ZadatakKorisnik.tacno == False)
        .group_by(Greska.tip_greske, Greska.opis)
        .order_by(func.count(ZadatakKorisnik.id).desc())
        .all()
    )

# POST
def create_zadatak_korisnik(db: Session, zadatak_korisnik: ZadatakKorisnik):
    db.add(zadatak_korisnik)
    db.commit()
    db.refresh(zadatak_korisnik)
    return zadatak_korisnik
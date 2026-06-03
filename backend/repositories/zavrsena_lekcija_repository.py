from sqlalchemy.orm import Session
from models.zavrsena_lekcija import ZavrsenaLekcija

# GET
def get_all_zavrsena_lekcija(db: Session):
    return db.query(ZavrsenaLekcija).all()

def get_zavrsena_lekcija_by_id(db: Session, id: int):
    return db.query(ZavrsenaLekcija).filter(ZavrsenaLekcija.id == id).first()

def get_zavrsena_lekcija_by_korisnik_id(db: Session, korisnik_id: int):
    return db.query(ZavrsenaLekcija).filter(ZavrsenaLekcija.korisnik_id == korisnik_id).all()

def get_zavrsena_lekcija_by_lekcija_id(db: Session, lekcija_id: int):
    return db.query(ZavrsenaLekcija).filter(ZavrsenaLekcija.lekcija_id == lekcija_id).first()

# POST
def create_zavrsena_lekcija(db: Session, zavrsena_lekcija: ZavrsenaLekcija):
    db.add(zavrsena_lekcija)
    db.commit()
    db.refresh(zavrsena_lekcija)
    return zavrsena_lekcija
from sqlalchemy.orm import Session
from models.lekcija import Lekcija


def get_all_lekcije(db: Session):
    return db.query(Lekcija).all()


def get_lekcija_by_id(db: Session, lekcija_id: int):
    return db.query(Lekcija).filter(Lekcija.id == lekcija_id).first()


def get_lekcija_by_naziv(db: Session, naziv: str):
    return db.query(Lekcija).filter(Lekcija.naziv == naziv).first()


def create_lekcija(db: Session, lekcija: Lekcija):
    db.add(lekcija)
    db.commit()
    db.refresh(lekcija)
    return lekcija


def update_lekcija(db: Session, lekcija: Lekcija):
    db.commit()
    db.refresh(lekcija)
    return lekcija


def delete_lekcija(db: Session, lekcija: Lekcija):
    db.delete(lekcija)
    db.commit()
from sqlalchemy.orm import Session
from models.zadatak import Zadatak


def get_all_zadaci(db: Session):
    return db.query(Zadatak).all()


def get_zadatak_by_id(db: Session, zadatak_id: int):
    return db.query(Zadatak).filter(Zadatak.id == zadatak_id).first()


def get_zadaci_by_lekcija_id(db: Session, lekcija_id: int):
    return db.query(Zadatak).filter(Zadatak.lekcija_id == lekcija_id).all()


def create_zadatak(db: Session, zadatak: Zadatak):
    db.add(zadatak)
    db.commit()
    db.refresh(zadatak)
    return zadatak


def update_zadatak(db: Session, zadatak: Zadatak):
    db.commit()
    db.refresh(zadatak)
    return zadatak


def delete_zadatak(db: Session, zadatak: Zadatak):
    db.delete(zadatak)
    db.commit()

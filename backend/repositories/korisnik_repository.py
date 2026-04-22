from sqlalchemy.orm import Session
from models.korisnik import Korisnik

def get_all_users(db: Session):
    return db.query(Korisnik).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(Korisnik).filter(Korisnik.id == user_id).first() #first je LIMIT 1

def get_user_by_username(db: Session, username: str):
    return db.query(Korisnik).filter(Korisnik.username == username).first()

def get_user_by_mail(db: Session, mail: str):
    return db.query(Korisnik).filter(Korisnik.mail == mail).first()

def create_user():
    pass
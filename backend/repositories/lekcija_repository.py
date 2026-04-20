from sqlalchemy.orm import Session
from backend.models.lekcija_model import Lekcija


def get_all_lekcije(db: Session):
    return db.query(Lekcija).all()
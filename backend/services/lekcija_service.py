from sqlalchemy.orm import Session
from repositories.lekcija_repository import get_all_lekcije


def procitaj_sve_lekcije(db: Session):
    return get_all_lekcije(db)
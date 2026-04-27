from sqlalchemy.orm import Session
from models.progres import Progres

# GET
def get_progres_by_id(db: Session, progres_id: int):
    return db.query(Progres).filter(Progres.id == progres_id).first()

def get_progres_by_korisnik_id(db: Session, korisnik_id: int):
    return db.query(Progres).filter(Progres.korisnik_id == korisnik_id).first()

# POST (progres se kreira interno u korisniku)
def create_progres(db:Session, progres: Progres):
    db.add(progres)
    db.commit()
    db.refresh(progres)
    return progres

# PUT
def update_progres(db:Session, progres: Progres):
    db.commit()
    db.refresh(progres)
    return progres
from sqlalchemy.orm import Session
from models.greska import Greska

# GET (po id, po tipu, sistem poziva kad treba da se prikupi info o greski)
def get_greska_by_id(db: Session, greska_id: int):
    return db.query(Greska).filter(Greska.id == greska_id).first()

def get_greska_by_tip(db: Session, tip_greske: str):
    return db.query(Greska).filter(Greska.tip_greske == tip_greske).first()

# POST ADMIN RUTA (ne dodaje korisnik nista, to se doda u bazi od strane admina i dopunjava po potrebi kasnije)
def create_greska(db: Session, greska: Greska):
    db.add(greska)
    db.commit()
    db.refresh(greska)
    return greska

# PUT ADMIN RUTA (iskreno mislim da nista kod greske nema da se mijenja, postoje odredjene definisane greske u bazi, ali eto dodao bih mijenjanje opisa recimo i dodavanje tipa greske)
def update_greska(db: Session, greska: Greska):
    db.commit()
    db.refresh(greska)
    return greska

# DELETE ADMIN RUTA (ja isto ne znam pravi li se ruta konkretno ovdje ili se samo poziva ovaj sql upit negdje drugo, al eto)
def delete_greska(db: Session, greska: Greska):
    # mozda treba provjera za id prije brisanja, vidjecemo oce li se to ispitivat u service
    db.delete(greska)
    db.commit()
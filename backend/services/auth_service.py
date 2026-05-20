from sqlalchemy.orm import Session
from fastapi import HTTPException, status   
from repositories import korisnik_repository
from utils.auth import create_access_token
from utils.security import verify_password

def login(db: Session, username: str, password: str):
    # 1. Nađi korisnika po usernameu
    korisnik = korisnik_repository.get_user_by_username(db, username)
    # 2. Ako ne postoji — greška
    if not korisnik:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pogrešno korisničko ime ili lozinka",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # 3. Provjeri password
    if not verify_password(password, korisnik.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pogrešno korisničko ime ili lozinka",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # 4. Generiši token i vrati ga
    access_token = create_access_token(data={"sub": korisnik.username})
    return {"access_token": access_token, "token_type": "bearer"}
"""
3 stvari potrebne:
1. Secret key - tajna lozinka kojom se potpisuje token
2. Funkcija za kreiranje tokena
3. Funkcija za verifikaciju tokena

header.payload.signature
- Header — tip tokena i algoritam
- Payload — podaci unutra, npr. {"user_id": 5, "exp": 1234567890} — ko si i kad token ističe
- Signature — kriptografski potpis koji garantuje da token nije falsifikovan
"""

import os
from dotenv import load_dotenv

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

from database import get_db
from repositories import korisnik_repository

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30  # 30 dana


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Nevazeci token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Nevazeci token")
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = verify_token(token)
    user = korisnik_repository.get_user_by_username(db, username)
    if user is None:
        raise HTTPException(status_code=401, detail="Korisnik nije pronadjen")
    return user

def get_current_admin(current_user = Depends(get_current_user)):
    if current_user.uloga != "admin":
        raise HTTPException(status_code=403, detail="Nemas admin pristup")
    return current_user
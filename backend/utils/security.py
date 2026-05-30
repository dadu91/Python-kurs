import re
from passlib.context import CryptContext

def validiraj_sifru(sifra: str) -> bool:
    if not re.search("[A-Z]", sifra):
        return False
    if not re.search("[0-9]", sifra):
        return False
    if not re.search("[!@#$%^&*(),.?]", sifra):
        return False
    if len(sifra) < 8:
        return False
    
    return True

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# provjera da li se hashovani password poklapa sa onim koji korisnik unese
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
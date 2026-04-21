from fastapi import FastAPI
from controllers.korisnik_controller import router as korisnik_router
from backend.controllers.lekcija_controller import router as lekcija_router

app = FastAPI()

# Registracija tvog rutera
app.include_router(korisnik_router)

# Registracija Petrovog rutera
app.include_router(lekcija_router)

@app.get("/")
def home():
    return {"poruka": "Sistem je online i lekcije su spremne!"}
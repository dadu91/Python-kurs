from fastapi import FastAPI
from controllers.korisnik_controller import router as korisnik_router
from controllers.lekcija_controller import router as lekcija_router
from controllers.progres_controller import router as progres_router
from controllers.greska_controller import router as greska_router
from controllers.zavrsena_lekcija_controller import router as zavrsena_lekcija_router
from controllers.zadatak_korisnik_controller import router as zadatak_korisnik_router

app = FastAPI()

#Registracija rutera
app.include_router(korisnik_router)
app.include_router(lekcija_router)
app.include_router(progres_router)
app.include_router(greska_router)
app.include_router(zavrsena_lekcija_router)
app.include_router(zadatak_korisnik_router)

@app.get("/")
def home():
    return {"poruka": "Sistem je online i lekcije su spremne!"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.korisnik_controller import router as korisnik_router
from controllers.lekcija_controller import router as lekcija_router
from controllers.progres_controller import router as progres_router
from controllers.greska_controller import router as greska_router
from controllers.zavrsena_lekcija_controller import router as zavrsena_lekcija_router
from controllers.zadatak_korisnik_controller import router as zadatak_korisnik_router
from controllers.zadatak_controller import router as zadatak_router
from controllers.auth_controller import router as auth_router
from controllers.kod_controller import router as kod_router
from controllers.admin_controller import router as admin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#Registracija rutera
app.include_router(korisnik_router)
app.include_router(lekcija_router)
app.include_router(progres_router)
app.include_router(greska_router)
app.include_router(zavrsena_lekcija_router)
app.include_router(zadatak_router)
app.include_router(zadatak_korisnik_router)
app.include_router(auth_router)
app.include_router(kod_router)
app.include_router(admin_router)

@app.get("/")
def home():
    return {"poruka": "Sistem je online i lekcije su spremne!"}
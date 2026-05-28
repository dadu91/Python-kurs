from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.korisnik_controller import router as korisnik_router
from controllers.lekcija_controller import router as lekcija_router
from controllers.kod_controller import router as kod_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registracija tvog rutera
app.include_router(korisnik_router)

# Registracija Petrovog rutera
app.include_router(lekcija_router)

app.include_router(kod_router)

@app.get("/")
def home():
    return {"poruka": "Sistem je online i lekcije su spremne!"}
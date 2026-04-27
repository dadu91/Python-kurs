from fastapi import FastAPI
from controllers.korisnik_controller import router as korisnik_router
from controllers.lekcija_controller import router as lekcija_router
from controllers.progres_controller import router as progres_router
app = FastAPI()

# Registracija tvog rutera
app.include_router(korisnik_router)

# Registracija Petrovog rutera
app.include_router(lekcija_router)

app.include_router(progres_router)

@app.get("/")
def home():
    return {"poruka": "Sistem je online i lekcije su spremne!"}
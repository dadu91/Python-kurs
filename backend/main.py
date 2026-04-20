from fastapi import FastAPI

from backend.controllers.lekcija_controller import router as lekcija_router

app = FastAPI()

app.include_router(lekcija_router)


@app.get("/")
def pocetna():
    return {"poruka": "Aplikacija radi."}
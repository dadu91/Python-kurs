from fastapi import FastAPI
from controllers.korisnik_controller import router

app = FastAPI()

# registracija rutera
app.include_router(router)

@app.get("/")
def home():
    return {"poruka": "Sistem je online!"}
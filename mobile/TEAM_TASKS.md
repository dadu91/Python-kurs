# Plan za mobilni MVP

Cilj do sjutra: Android MVP koji radi na Xiaomi telefonu preko Expo Go.

Backend ostaje isti. Mobilna aplikacija koristi postojece FastAPI rute.

## Uloge

### Osoba 1: mobilni UI i navigacija

Radi u `mobile/`.

Prioritet:

- srediti login ekran
- srediti register ekran
- napraviti dashboard ekran
- napraviti listu lekcija
- napraviti ekran jedne lekcije

Ne gubiti vrijeme na admin panel dok osnovni korisnicki tok ne radi.

### Osoba 2: lekcije, zadaci i progres

Radi u `mobile/`, uz stalno gledanje postojeceg `frontend/src/pages/Lesson.jsx`.

Prioritet:

- prebaciti osnovni prikaz lekcije
- ucitati zadatke po lekciji
- dodati mini kviz tok
- dodati osnovno zavrsavanje lekcije
- slati progres backendu

Ako nesto puca, prvo provjeriti API odgovor u backendu, pa tek onda mijenjati mobilni kod.

### Osoba 3: integracija, backend i telefon

Pokrece backend, Expo i testira na Xiaomi telefonu.

Prioritet:

- pokrenuti backend sa `--host 0.0.0.0`
- podesiti API URL u mobilnoj aplikaciji na IP adresu racunara
- provjeriti login/register na telefonu
- provjeriti da `/lekcije/` radi na telefonu
- spojiti promjene od ostalih
- pripremiti demo

## Komande

Backend:

```powershell
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

Mobile:

```powershell
cd mobile
npm install
npm start
```

## Bitno

Telefon ne koristi `localhost`.

U mobilnoj aplikaciji API adresa mora biti IP adresa racunara, na primjer:

```text
http://192.168.1.25:8000
```

Za jednodnevni MVP prvo zavrsiti:

1. login
2. register
3. dashboard
4. lista lekcija
5. prikaz jedne lekcije
6. osnovni progres

Tek nakon toga raditi profil, admin panel, animacije i finese.

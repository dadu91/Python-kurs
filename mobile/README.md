# Python Kurs Mobile

React Native/Expo verzija postojeceg Python kurs projekta.

## Prvi start

1. U `mobile/app.json` promijeni `extra.apiUrl` na IP adresu racunara, na primjer:

   `http://192.168.1.25:8000`

2. Telefon i racunar moraju biti na istoj Wi-Fi mrezi.

3. Pokreni backend tako da slusa mrezu:

   `uvicorn main:app --host 0.0.0.0 --port 8000`

4. Instaliraj i pokreni mobilnu aplikaciju:

   `npm install`

   `npm start`

5. Na Xiaomi telefonu instaliraj Expo Go i skeniraj QR kod.

## APK kasnije

Kada aplikacija bude spremna:

`npx eas build -p android --profile preview`

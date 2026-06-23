const greske = {
  badge: "Lekcija 11",
  title: "Rad sa greškama u Pythonu",
  heroClass: "errors-hero",
  description:
    "U ovoj lekciji učiš kako da hvataš i obradiš greške u programu koristeći try i except — da program ne pada već uredno javi šta je pošlo po krivu.",
  duration: "30 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ zašto greške nastaju i kako ih hvatati", blockIndex: 0 },
    { tekst: "Znaš kako koristiti try i except", blockIndex: 1 },
    { tekst: "Znaš kako hvatati specifične vrste grešaka", blockIndex: 2 },
    { tekst: "Znaš šta radi finally blok", blockIndex: 3 },
  ],

  theoryBlocks: [
    {
      title: "Šta su greške i zašto nastaju?",
      text: "Greška u programu znači da Python nailazi na nešto što ne zna kako da izvrši. Program se tada ruši i ispisuje poruku o grešci. Najčešće greške su: pokušaj dijeljenja s nulom, pristup elementu koji ne postoji, ili sabiranje teksta i broja.",
      code: `print(10 / 0)`,
      codeObjasnjenje: [
        "10 / 0 — dijelimo sa nulom, Python ne zna šta da vrati",
        "Program se ruši i ispisuje: ZeroDivisionError: division by zero",
        "Sve linije koda ispod ove neće se izvršiti",
        "Rješenje — uhvatiti grešku i obraditi je prije nego što sruši program",
      ],
      vjezbaSintakse: null,
    },
    {
      title: "try i except",
      text: "try i except su način da kažeš Pythonu: pokušaj ovo, a ako dođe do greške — uradi ovo umjesto da se sruši. Kod u try bloku se izvršava normalno, a except blok se aktivira samo ako nastane greška.",
      code: `try:
    broj = int("abc")
    print(broj)
except:
    print("Doslo je do greske!")

print("Program nastavlja...")`,
      codeObjasnjenje: [
        "try: — počinjemo blok koji može izazvati grešku",
        "int(\"abc\") — pokušavamo pretvoriti tekst u broj, ovo izaziva grešku",
        "except: — ovaj blok se izvršava umjesto pada programa",
        "print(\"Program nastavlja...\") — program se ne ruši, nastavlja dalje",
      ],
      vjezbaSintakse: {
        uputstvo: "Napiši try/except koji pokušava podijeliti 10 sa 0. U except bloku ispiši 'Ne moze se dijeliti sa nulom.'",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: try:, print(10 / 0), except:, print('Ne moze se dijeliti sa nulom.').",
        check: (code) =>
          code.includes("try:") &&
          code.includes("10/0") &&
          code.includes("except:") &&
          code.includes("print("),
      },
    },
    {
      title: "Specifične vrste grešaka",
      text: "Možeš hvatati specifičnu vrstu greške umjesto svake. To je korisno kada želiš dati različitu poruku za različite greške, ili kada znaš tačno koja greška može nastati.",
      code: `try:
    broj = int(input("Upiši broj: "))
    rezultat = 10 / broj
    print("Rezultat:", rezultat)
except ValueError:
    print("To nije broj!")
except ZeroDivisionError:
    print("Ne moze se dijeliti sa nulom!")`,
      codeObjasnjenje: [
        "except ValueError — hvata grešku ako korisnik upiše tekst umjesto broja",
        "except ZeroDivisionError — hvata grešku ako korisnik upiše 0",
        "Svaka greška ima svoje ime — ValueError, ZeroDivisionError, TypeError...",
        "Ako nastane greška koja nije navedena, program se i dalje ruši",
      ],
      vjezbaSintakse: null,
    },
    {
      title: "finally — uvijek se izvršava",
      text: "finally blok se izvršava uvijek — bez obzira da li je nastala greška ili ne. Koristi ga za čišćenje: zatvaranje fajla, ispis poruke o završetku i slično.",
      code: `try:
    rezultat = 10 / 2
    print("Rezultat:", rezultat)
except ZeroDivisionError:
    print("Greska!")
finally:
    print("Operacija zavrsena.")`,
      codeObjasnjenje: [
        "try: — pokušavamo 10 / 2, ovo uspijeva",
        "except: — ne aktivira se jer nema greške",
        "finally: — uvijek se izvršava, bez obzira na grešku",
        "Ispisuje: Rezultat: 5.0 pa Operacija zavrsena.",
      ],
      vjezbaSintakse: null,
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Koji blok se izvršava kada nastane greška?",
      answers: ["try", "except", "finally"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Šta se dešava sa kodom ispod greške ako nema try/except?",
      answers: [
        "Izvršava se normalno",
        "Program se ruši i ostatak se ne izvršava",
        "Python automatski ispravlja grešku",
      ],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Koji blok se UVIJEK izvršava, bez obzira na grešku?",
      answers: ["try", "except", "finally"],
      correct: 2,
    },
    {
      redoslijed: 5,
      question: "Koja greška nastaje pri dijeljenju sa nulom?",
      answers: ["ValueError", "ZeroDivisionError", "TypeError"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: "Koja greška nastaje kad pokušaš int(\"abc\")?",
      answers: ["TypeError", "NameError", "ValueError"],
      correct: 2,
    },
  ],

  codingTasks: [
    {
      redoslijed: 7,
      title: "Sigurna kalkulacija",
      description:
        "Napiši program koji pokušava podijeliti dva broja. Ako nastane ZeroDivisionError, ispiši 'Dijeljenje sa nulom nije dozvoljeno.' Dodaj finally blok koji uvijek ispisuje 'Kalkulacija zavrsena.'",
      solution: `a = 10
b = 0

try:
    rezultat = a / b
    print("Rezultat:", rezultat)
except ZeroDivisionError:
    print("Dijeljenje sa nulom nije dozvoljeno.")
finally:
    print("Kalkulacija zavrsena.")`,
      expectedOutput: `Dijeljenje sa nulom nije dozvoljeno.\nKalkulacija zavrsena.`,
      hint: "Postavi b = 0 da izazoveš grešku. Koristi except ZeroDivisionError i finally blok.",
      check: (code) =>
        code.includes("try:") &&
        code.includes("exceptzerodivisionerror") &&
        code.includes("finally:") &&
        code.includes("print("),
    },
    {
      redoslijed: 8,
      title: "Bezbjedno čitanje iz liste",
      description:
        "Napravi listu sa 3 elementa. Pokušaj pristupiti elementu na indeksu 10. Uhvati IndexError i ispiši 'Indeks ne postoji.' Na kraju ispiši 'Program završen.'",
      solution: `lista = [10, 20, 30]

try:
    print(lista[10])
except IndexError:
    print("Indeks ne postoji.")
finally:
    print("Program zavrsen.")`,
      expectedOutput: `Indeks ne postoji.\nProgram zavrsen.`,
      hint: "Koristi lista[10] unutar try bloka, except IndexError za grešku i finally za završnu poruku.",
      check: (code) =>
        code.includes("try:") &&
        code.includes("exceptindexerror") &&
        code.includes("finally:") &&
        code.includes("print("),
    },
  ],
};

export default greske;

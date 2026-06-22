const stringovi = {
  badge: "Lekcija 5",
  title: "Stringovi u Pythonu",
  heroClass: "intro-hero",
  description:
    "U ovoj lekciji učiš šta su stringovi, kako se kreiraju i kako se koriste osnovne metode za rad sa tekstom.",
  duration: "35 min",
  level: "Početnik",

  goals: [
    { tekst: "Znaš šta je string i kako se kreira", blockIndex: 0 },
    { tekst: "Umiješ da spajash stringove i ponavljaš ih", blockIndex: 1 },
    { tekst: "Koristiš metode: upper, lower, len, strip", blockIndex: 2 },
    { tekst: "Znaš kako funkcioniše f-string formatiranje", blockIndex: 3 },
  ],

  theoryBlocks: [
    {
      title: "Šta je string?",
      text: "String je niz znakova — tekst. U Pythonu se piše između jednostrukih ili dvostrukih navodnika. Možeš koristiti oba, ali budi dosljedan u jednom programu.",
      code: `ime = "Petar"
grad = 'Sarajevo'
poruka = "Učim Python!"

print(ime)
print(grad)
print(poruka)`,
      codeObjasnjenje: [
        'ime = "Petar" — string sa dvostrukim navodnicima',
        "grad = 'Sarajevo' — string sa jednostrukim navodnicima, isto važi",
        'poruka = "Učim Python!" — string može sadržati slova, brojeve i znakove',
      ],
      vjezbaSintakse: {
        uputstvo: 'Kreiraj promjenljivu grad i dodijeli joj vrijednost "Mostar", pa je ispiši.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: grad = "Mostar" i print(grad).',
        check: (code) =>
          (code.includes('grad="mostar"') || code.includes("grad='mostar'")) &&
          code.includes("print(grad)"),
      },
    },
    {
      title: "Spajanje i ponavljanje stringova",
      text: 'Operator + spaja dva stringa zajedno — to se zove konkatenacija. Operator * ponavlja string određeni broj puta. Paziti: ne možeš sabirati string i broj direktno, treba ih konvertovati.',
      code: `ime = "Petar"
prezime = "Petrović"

puno_ime = ime + " " + prezime
print(puno_ime)

linija = "-" * 10
print(linija)`,
      codeObjasnjenje: [
        'ime + " " + prezime — spaja tri stringa: ime, razmak i prezime',
        'puno_ime će biti "Petar Petrović"',
        '"-" * 10 — ponavlja crticu 10 puta',
        'linija će biti "----------"',
      ],
      vjezbaSintakse: {
        uputstvo: 'Spoji stringove "Python" i " je zabavan" u jednu promjenljivu poruka i ispiši je.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: poruka = "Python" + " je zabavan" i print(poruka).',
        check: (code) =>
          code.includes("poruka") &&
          (code.includes('"python"+"jezabavan"') ||
            code.includes('"python"+" jezabavan"') ||
            code.includes("poruka=") ) &&
          code.includes("print(poruka)"),
      },
    },
    {
      title: "Korisne metode za stringove",
      text: "Python ima ugrađene metode koje pozivamo sa tačkom iza stringa. Metoda je kao funkcija vezana za string. Najkorisnije su: upper(), lower(), strip() i len().",
      code: `tekst = "  zdravo  "

print(tekst.upper())    # ZDRAVO
print(tekst.lower())    # zdravo
print(tekst.strip())    # zdravo  (bez razmaka)
print(len("Python"))    # 6`,
      codeObjasnjenje: [
        'tekst.upper() — pretvara sva slova u velika',
        'tekst.lower() — pretvara sva slova u mala',
        'tekst.strip() — uklanja razmake sa početka i kraja stringa',
        'len("Python") — vraća broj znakova u stringu, ovdje 6',
      ],
      vjezbaSintakse: {
        uputstvo: 'Kreiraj promjenljivu ime = "petar" i ispiši je velikim slovima pomoću upper().',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: ime = "petar" i print(ime.upper()).',
        check: (code) =>
          (code.includes('ime="petar"') || code.includes("ime='petar'")) &&
          code.includes("ime.upper()"),
      },
    },
    {
      title: "F-string formatiranje",
      text: "F-string je najlakši način da ubaciš vrijednost promjenljive direktno u tekst. Pišeš f ispred navodnika, a promjenljivu staviš u vitičaste zagrade unutar teksta.",
      code: `ime = "Ana"
godine = 22

poruka = f"Zdravo, {ime}! Imaš {godine} godina."
print(poruka)`,
      codeObjasnjenje: [
        'f"..." — f ispred navodnika označava f-string',
        '{ime} — Python ovdje umeće vrijednost promjenljive ime',
        '{godine} — isto za broj, Python ga automatski pretvara u tekst',
        'Rezultat: "Zdravo, Ana! Imaš 22 godina."',
      ],
      vjezbaSintakse: {
        uputstvo: 'Kreiraj promjenljive ime = "Petar" i grad = "Banja Luka", pa ispiši f-string: "Petar živi u Banja Luka".',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: f"{ime} živi u {grad}"',
        check: (code) =>
          code.includes("f\"") &&
          code.includes("{ime}") &&
          code.includes("{grad}") &&
          code.includes("print"),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Koji operator se koristi za spajanje stringova?",
      answers: ["*", "+", "&"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: 'Šta vraća len("Python")?',
      answers: ["5", "6", "7"],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: 'Šta ispisuje: print("ha" * 3)?',
      answers: ["ha ha ha", "hahaha", "ha3"],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Koja metoda uklanja razmake sa početka i kraja stringa?",
      answers: ["remove()", "strip()", "clean()"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: 'Šta ispisuje: ime = "ana"; print(ime.upper())?',
      answers: ["ana", "Ana", "ANA"],
      correct: 2,
    },
  ],

  codingTasks: [
    {
      redoslijed: 7,
      title: "Zadatak 1: Predstavi se",
      description:
        'Kreiraj promjenljive ime i godine, pa koristeći f-string ispiši poruku u obliku: "Zovem se Petar i imam 20 godina."',
      solution: `ime = "Petar"
godine = 20
print(f"Zovem se {ime} i imam {godine} godina.")`,
      expectedOutput: `Zovem se Petar i imam 20 godina.`,
      hint: "Treba ti f-string sa {ime} i {godine}.",
      check: (code) =>
        code.includes("f\"") &&
        code.includes("{ime}") &&
        code.includes("{godine}") &&
        code.includes("print"),
    },
    {
      redoslijed: 8,
      title: "Zadatak 2: Broj znakova",
      description:
        'Kreiraj promjenljivu tekst = "Python je odličan" i ispiši koliko znakova ima koristeći len().',
      solution: `tekst = "Python je odličan"
print(len(tekst))`,
      expectedOutput: `18`,
      hint: "Treba ti len(tekst) unutar print().",
      check: (code) =>
        code.includes("tekst") &&
        code.includes("len(tekst)") &&
        code.includes("print"),
    },
  ],
};

export default stringovi;

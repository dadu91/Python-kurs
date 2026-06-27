const stringovi = {
  badge: "Lekcija 6",
  title: "Stringovi u Pythonu",
  heroClass: "intro-hero",
  description:
    "U ovoj lekciji učiš šta su stringovi, kako se kreiraju i kako se koriste osnovne metode za rad sa tekstom.",
  duration: "35 min",
  level: "Početnik",

  goals: [
    { tekst: "Znaš šta je string i kako se kreira", blockIndex: 0 },
    { tekst: "Umiješ da spajаš stringove i ponavljaš ih", blockIndex: 1 },
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
          code.includes("poruka=") &&
          (code.includes('"python"+"jezabavan"') ||
            code.includes('"python+jezabavan"') ||
            code.includes('"pythonjezabavan"')) &&
          code.includes("print(poruka)"),
      },
    },
    {
      title: "Korisne metode za stringove",
      text: "Python ima ugrađene metode koje pozivamo sa tačkom iza stringa. Metoda je kao funkcija vezana za string. Najkorisnije su: upper(), lower(), strip() i len().",
      code: `tekst = "  zdravo  "

print(tekst.upper())
print(tekst.lower())
print(tekst.strip())
print(len("Python"))`,
      codeObjasnjenje: [
        'tekst.upper() — pretvara sva slova u velika → "  ZDRAVO  "',
        'tekst.lower() — pretvara sva slova u mala → "  zdravo  "',
        'tekst.strip() — uklanja razmake sa početka i kraja → "zdravo"',
        'len("Python") — vraća broj znakova u stringu → 6',
      ],
      vjezbaSintakse: {
        uputstvo: 'Dat ti je username korisnika sa nepotrebnim razmacima. Očisti ga sa strip(), pa ispiši velikim slovima — kao što bi izgledalo na profilu.',
        initialCode: 'korisnik = "  ana petrović  "\n',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: korisnik = korisnik.strip() i print(korisnik.upper()).',
        check: (code) =>
          code.includes("korisnik") &&
          code.includes("strip()") &&
          code.includes("upper()") &&
          code.includes("print("),
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
        uputstvo: 'Data ti je naziv proizvoda i cijena. Ispiši račun u obliku: "Proizvod: jabuka, Cijena: 1.5 E" koristeći f-string.',
        initialCode: 'proizvod = "jabuka"\ncijena = 1.5\n',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: print(f"Proizvod: {proizvod}, Cijena: {cijena} E")',
        check: (code) =>
          code.includes("f\"") &&
          code.includes("{proizvod}") &&
          code.includes("{cijena}") &&
          code.includes("print("),
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
      title: "Zvjezdani trougao",
      description:
        "Napiši program koji ispisuje trougao od zvjezdica sa 5 redova koristeći for petlju i množenje stringa. Izlaz treba izgledati ovako:\n*\n**\n***\n****\n*****",
      solution: `for i in range(1, 6):
    print("*" * i)`,
      expectedOutput: `*\n**\n***\n****\n*****`,
      hint: "Treba ti: for i in range(1, 6): i print(\"*\" * i). String pomnoži sa brojem da dobiješ više zvjezdica.",
      check: (code) =>
        code.includes("for") &&
        code.includes("range(1,6)") &&
        code.includes("\"*\"*i") &&
        code.includes("print("),
    },
  ],
};

export default stringovi;

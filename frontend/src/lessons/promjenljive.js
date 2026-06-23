const promjenljive = {
  badge: "Lekcija 2",
  title: "Promjenljive u Pythonu",
  heroClass: "variables-hero",
  description:
    "U ovoj lekciji učiš šta su promjenljive, kako se koriste i koji tipovi podataka mogu da se čuvaju u njima.",
  duration: "30 min",
  level: "Početnik",

 goals: [
  { tekst: "Razumiješ šta je promjenljiva i tipove podataka", blockIndex: 0 },
  { tekst: "Znaš kako se mijenja vrijednost promjenljive", blockIndex: 1 },
],

  theoryBlocks: [
    {
      title: "Šta je promjenljiva?",
      text: "Promjenljive služe za čuvanje podataka u memoriji. Daješ joj ime i u nju stavljaš vrijednost. Kad ti zatreba taj podatak, pozoveš je po imenu. U Pythonu nema razlike kako se promjenljiva deklariše — tekst, broj, decimala, sve ide na isti način.",
      code: `ime = "Ana"
godine = 20
visina = 1.68
student = True

print(ime)
print(godine)
print(type(ime))`,
      codeObjasnjenje: [
        "ime = \"Ana\" — promjenljiva tipa string (tekst)",
        "godine = 20 — promjenljiva tipa integer (cijeli broj)",
        "visina = 1.68 — promjenljiva tipa float (decimalni broj)",
        "student = True — promjenljiva tipa boolean (tačno/netačno)",
        "print(type(ime)) — ispisuje tip podatka promjenljive ime → <class 'str'>",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi promjenljivu 'grad' sa nekim gradom i promjenljivu 'broj_stanovnika' sa brojem. Ispiši obje i ispiši tip promjenljive 'grad' koristeći type().",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: grad = \"...\", broj_stanovnika = ..., print(grad), print(broj_stanovnika) i print(type(grad)).",
        check: (code) =>
          code.includes("grad") &&
          code.includes("broj_stanovnika") &&
          code.includes("type(grad)") &&
          code.includes("print("),
      },
    },
    {
      title: "Promjena vrijednosti",
      text: "Promjenljiva može da promijeni vrijednost u toku programa. Čak možeš promijeniti i tip podatka koji čuva — Python to dozvoljava.",
      code: `broj = 10
print(broj)   # 10

broj = 20
print(broj)   # 20

broj = "dvadeset"
print(broj)   # dvadeset`,
      vjezbaSintakse: {
        uputstvo: "Napravi promjenljivu 'bodovi', dodijeli joj vrijednost 100, pa je ispiši.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: bodovi = 100 i ispod print(bodovi).",
        check: (code) =>
          code.includes("bodovi") && code.includes("100") && code.includes("print"),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Šta je promjenljiva u Pythonu?",
      answers: ["Naredba za ispis", "Mjesto gdje čuvamo podatak", "Vrsta petlje"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Koji tip podatka je: ime = \"Petar\"?",
      answers: ["int", "bool", "str"],
      correct: 2,
    },
    {
      redoslijed: 4,
      question: "Koja funkcija pokazuje tip podatka?",
      answers: ["print()", "type()", "input()"],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Šta će ispisati: x = 5; x = 10; print(x)?",
      answers: ["5", "10", "Grešku"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: "Koji tip podatka je: aktivan = True?",
      answers: ["str", "int", "bool"],
      correct: 2,
    },
  ],

  codingTasks: [],
};

export default promjenljive;
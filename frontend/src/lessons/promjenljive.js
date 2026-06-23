const promjenljive = {
  badge: "Lekcija 2",
  title: "Promjenljive u Pythonu",
  heroClass: "variables-hero",
  description:
    "U ovoj lekciji učiš šta su promjenljive, kako se koriste i koji tipovi podataka mogu da se čuvaju u njima.",
  duration: "30 min",
  level: "Početnik",

 goals: [
  { tekst: "Razumiješ šta je promjenljiva", blockIndex: 0 },
  { tekst: "Znaš kako se dodjeljuje vrijednost", blockIndex: 1 },
  { tekst: "Prepoznaješ različite tipove podataka", blockIndex: 2 },
  { tekst: "Znaš da Python sam prepoznaje tip podatka", blockIndex: 3 },
],

  theoryBlocks: [
    {
      title: "Šta je promjenljiva?",
      text: "Promenljive služe za čuvanje podataka u memoriji. Daješ joj ime i u nju stavljaš vrijednost. Kad ti zatreba taj podatak, pozoveš je po imenu.",
      code: `ime = "Ana"
godine = 20
visina = 1.68
student = True

print(ime)
print(godine)`,
      vjezbaSintakse: null,
    },
    {
      title: "Python sam prepoznaje tip podatka",
      text: "Za razliku od nekih drugih jezika, u Pythonu ne moraš reći koji tip podatka čuvaš. Python to sam prepoznaje. U istu promjenljivu možeš staviti broj, tekst, decimalni broj ili logičku vrijednost.",
      code: `x = 10          # int - cijeli broj
x = "zdravo"    # str - tekst
x = 3.14        # float - decimalni broj
x = True        # bool - tačno/netačno

print(type(x))  # ispisuje tip podatka`,
      vjezbaSintakse: {
        uputstvo: "Napravi promjenljivu 'grad' i dodijeli joj vrijednost 'Sarajevo', pa je ispiši.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: grad = \"Sarajevo\" i ispod print(grad).",
        check: (code) =>
          code.includes("grad") && code.includes("sarajevo") && code.includes("print"),
      },
    },
    {
      title: "Tipovi podataka",
      text: "Postoje četiri osnovna tipa podataka u Pythonu: int (cijeli brojevi), float (decimalni brojevi), str (tekst) i bool (tačno/netačno). Svaki tip se ponaša drugačije.",
      code: `broj = 5          # int
cijena = 9.99     # float
naziv = "Python"  # str
aktivan = False   # bool

print(type(broj))    # <class 'int'>
print(type(cijena))  # <class 'float'>
print(type(naziv))   # <class 'str'>
print(type(aktivan)) # <class 'bool'>`,
      vjezbaSintakse: null,
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
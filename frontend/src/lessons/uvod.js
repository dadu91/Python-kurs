const uvod = {
  badge: "Lekcija 1",
  title: "Uvod u Python",
  heroClass: "intro-hero",
  description:
    "U ovoj lekciji učiš šta je Python, kako se pokreće prvi program i kako se koristi print naredba.",
  duration: "20 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je Python", blockIndex: 0 },
    { tekst: "Znaš čemu služi print()", blockIndex: 1 },
    { tekst: "Umiješ da napišeš prvi program", blockIndex: 1 },
  ],

  theoryBlocks: [
    {
      title: "Šta je Python?",
      text: "Python je programski jezik koji se koristi za web aplikacije, automatizaciju, analizu podataka, vještačku inteligenciju i mnoge druge oblasti.",
      code: `print("Zdravo, Python!")`,
      codeObjasnjenje: [
        'print("Zdravo, Python!") — ispisuje tekst Zdravo, Python! na ekran',
        "Tekst koji želimo ispisati pišemo između navodnika unutar zagrade",
      ],
      vjezbaSintakse: {
        uputstvo: 'Napiši naredbu koja ispisuje tekst "Zdravo, Python!" na ekran.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: print("Zdravo, Python!")',
        check: (code) => code.includes('print("zdravo,python!")') || code.includes("print('zdravo,python!')"),
      },
    },
    {
      title: "Print naredba",
      text: "Naredba print() služi za ispis teksta ili vrijednosti na ekran. Tekst pišemo između navodnika.",
      code: `print("Učim Python")

ime = "Petar"
print("Zdravo, moje ime je", ime)`,
      codeObjasnjenje: [
        'print("Učim Python") — ispisuje tekst Učim Python',
        'ime = "Petar" — kreiramo promjenljivu ime i dodjeljujemo joj vrijednost Petar',
        'print("Zdravo, moje ime je", ime) — ispisuje tekst i vrijednost promjenljive zajedno',
      ],
      vjezbaSintakse: {
        uputstvo: 'Kreiraj promjenljivu ime = "Petar" i ispiši je naredbom print().',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: ime = "Petar" i print(ime).',
        check: (code) =>
          (code.includes('ime="petar"') || code.includes("ime='petar'")) &&
          code.includes("print(ime)"),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Koja naredba se koristi za ispis u Pythonu?",
      answers: ["echo()", "print()", "write()"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Šta će ispisati kod: print('Python')?",
      answers: ["Python", "print", "Grešku"],
      correct: 0,
    },
    {
      redoslijed: 4,
      question: "Tekst u Pythonu najčešće pišemo između:",
      answers: ["zagrada", "navodnika", "zareza"],
      correct: 1,
    },
  ],

  codingTasks: [
    {
      redoslijed: 5,
      title: "Zadatak 1: Ispiši svoje ime",
      description:
        'Kreiraj promjenljivu ime i dodijeli joj svoje ime kao tekst. Zatim ispiši poruku "Zdravo, " zajedno sa tom promjenljivom.',
      solution: `ime = "Petar"
print("Zdravo,", ime)`,
      expectedOutput: `Zdravo, Petar`,
      hint: 'Treba ti: ime = "...", print("Zdravo,", ime).',
      check: (code) =>
        code.includes("ime=") && code.includes('print("zdravo,"') || code.includes("print('zdravo,'"),
    },
    {
      redoslijed: 6,
      title: "Zadatak 2: Ispiši tri linije",
      description:
        "Napiši program koji ispisuje tri različite linije teksta koristeći tri print() naredbe.",
      solution: `print("Linija 1")
print("Linija 2")
print("Linija 3")`,
      expectedOutput: `Linija 1
Linija 2
Linija 3`,
      hint: "Treba ti tri odvojene print() naredbe, svaka sa različitim tekstom.",
      check: (code) => (code.match(/print\(/g) || []).length >= 3,
    },
  ],
};

export default uvod;

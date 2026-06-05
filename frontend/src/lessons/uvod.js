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
      vjezbaSintakse: null,
    },
    {
      title: "Print naredba",
      text: "Naredba print() služi za ispis teksta ili vrijednosti na ekran. Tekst pišemo između navodnika.",
      code: `print("Učim Python")

ime = "Petar"
print("Zdravo, moje ime je", ime)`,
      vjezbaSintakse: null,
    },
  ],

  questions: [
    {
      question: "Koja naredba se koristi za ispis u Pythonu?",
      answers: ["echo()", "print()", "write()"],
      correct: 1,
    },
    {
      question: "Šta će ispisati kod: print('Python')?",
      answers: ["Python", "print", "Grešku"],
      correct: 0,
    },
    {
      question: "Tekst u Pythonu najčešće pišemo između:",
      answers: ["zagrada", "navodnika", "zareza"],
      correct: 1,
    },
  ],

  codingTasks: [],
};

export default uvod;

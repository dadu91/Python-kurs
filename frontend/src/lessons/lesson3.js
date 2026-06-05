const lesson3 = {
  badge: "Lekcija 3",
  title: "Zadaci u Pythonu",
  heroClass: "tasks-hero",
  description:
    "U ovoj lekciji vježbaš osnovne Python zadatke koristeći promjenljive, uslove i petlje.",
  duration: "35 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ tekst zadatka", blockIndex: 0 },
    { tekst: "Koristiš input i print", blockIndex: 0 },
    { tekst: "Primjenjuješ uslove i petlje", blockIndex: 1 },
  ],

  theoryBlocks: [
    {
      title: "Kako rješavamo zadatke?",
      text: "Kod zadataka je najbitnije da prvo razumiješ šta se traži, zatim napraviš plan, pa tek onda pišeš kod.",
      code: `broj = int(input("Unesi broj: "))

if broj > 0:
    print("Broj je pozitivan")`,
      vjezbaSintakse: null,
    },
    {
      title: "Savjet za zadatke",
      text: "Uvijek testiraj program sa više primjera. Ako radi za jedan broj, ne znači da radi za sve.",
      code: `# Testiraj za:
# 2, 5, 0, -4`,
      vjezbaSintakse: null,
    },
  ],

  questions: [
    {
      question: "Koja funkcija služi za unos podataka?",
      answers: ["input()", "print()", "range()"],
      correct: 0,
    },
    {
      question: "Kako provjeravamo da li je broj paran?",
      answers: ["broj / 2 == 0", "broj % 2 == 0", "broj + 2 == 0"],
      correct: 1,
    },
    {
      question: "Šta radi if naredba?",
      answers: ["Ponavlja kod", "Provjerava uslov", "Ispisuje tekst"],
      correct: 1,
    },
  ],

  codingTasks: [],
};

export default lesson3;

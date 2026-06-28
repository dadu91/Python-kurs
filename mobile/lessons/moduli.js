const moduli = {
  badge: "Lekcija 10",
  title: "Moduli u Pythonu",
  heroClass: "modules-hero",
  description:
    "U ovoj lekciji učiš šta su moduli, kako se uvoze i kako koristiti math i random module koji dolaze uz Python.",
  duration: "30 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je modul i zašto ga koristimo", blockIndex: 0 },
    { tekst: "Znaš kako koristiti math modul", blockIndex: 1 },
    { tekst: "Znaš kako koristiti random modul", blockIndex: 2 },
  ],

  theoryBlocks: [
    {
      title: "Šta je modul?",
      text: "Modul je gotov skup funkcija koji možeš uvesti u svoj program. Zamislih to kao kutiju alata — ne moraš sam praviti svaki alat, jednostavno uzmeš kutiju koja ga već ima. Python dolazi sa stotinama ugrađenih modula.",
      code: `import math
import random

print(math.pi)
print(random.randint(1, 10))`,
      codeObjasnjenje: [
        "import math — uvozimo modul math koji sadrži matematičke funkcije",
        "import random — uvozimo modul random za rad sa slučajnim brojevima",
        "math.pi — konstanta pi (3.14159...)",
        "random.randint(1, 10) — slučajan cijeli broj između 1 i 10",
      ],
      vjezbaSintakse: null,
    },
    {
      title: "math modul",
      text: "math modul sadrži sve što ti treba za matematiku — kvadratni korijen, zaokruživanje, logaritme, trigonometriju i konstante poput pi i e.",
      code: `import math

print(math.sqrt(16))
print(math.pow(2, 8))
print(math.floor(3.9))
print(math.ceil(3.1))
print(math.pi)`,
      codeObjasnjenje: [
        "math.sqrt(16) — kvadratni korijen od 16 → 4.0",
        "math.pow(2, 8) — 2 na stepen 8 → 256.0",
        "math.floor(3.9) — zaokružuje na dole → 3",
        "math.ceil(3.1) — zaokružuje na gore → 4",
        "math.pi — konstanta pi → 3.141592653589793",
      ],
      vjezbaSintakse: {
        uputstvo: "Uvezi math modul i ispiši kvadratni korijen od proizvoljnog broja i vrijednost pi.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: import math, print(math.sqrt(...)) i print(math.pi).",
        check: (code) =>
          code.includes("importmath") &&
          code.includes("math.sqrt(") &&
          code.includes("math.pi"),
      },
    },
    {
      title: "random modul",
      text: "random modul korišten je svuda gdje treba slučajnost — igre, simulacije, testovi, šifre. Najkorisnije funkcije su randint() za slučajne brojeve i choice() za slučajan element iz liste.",
      code: `import random

print(random.randint(1, 100))
print(random.random())

boje = ["crvena", "plava", "zelena", "zuta"]
print(random.choice(boje))

random.shuffle(boje)
print(boje)`,
      codeObjasnjenje: [
        "random.randint(1, 100) — slučajan cijeli broj između 1 i 100",
        "random.random() — slučajan decimalni broj između 0.0 i 1.0",
        "random.choice(boje) — slučajno bira jedan element iz liste",
        "random.shuffle(boje) — miješa elemente liste slučajnim redoslijedom",
      ],
      vjezbaSintakse: {
        uputstvo: "Uvezi random modul, napravi listu od 4 broja i ispiši slučajno odabran element.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: import random, lista sa brojevima i random.choice(lista).",
        check: (code) =>
          code.includes("importrandom") &&
          code.includes("[") &&
          code.includes("random.choice(") &&
          code.includes("print("),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Koja ključna riječ se koristi za uvoz modula?",
      answers: ["include", "import", "require"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Šta vraća math.sqrt(25)?",
      answers: ["25", "5.0", "2.5"],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Šta radi random.choice(lista)?",
      answers: [
        "Miješa listu",
        "Vraća slučajno odabran element iz liste",
        "Vraća slučajan broj",
      ],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Šta vraća math.floor(4.9)?",
      answers: ["5", "4", "4.9"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: "Koji modul koristimo za slučajne brojeve?",
      answers: ["math", "random", "numbers"],
      correct: 1,
    },
  ],

  codingTasks: [
    {
      redoslijed: 7,
      title: "Kalkulator hipotenuse",
      description:
        "Uvezi math modul. Date su ti dvije stranice pravouglog trougla: a = 3 i b = 4. Izračunaj hipotenuzu koristeći Pitagorinu teoremu: c = √(a² + b²). Ispiši rezultat.",
      solution: `import math

a = 3
b = 4

c = math.sqrt(a**2 + b**2)
print("Hipotenuza:", c)`,
      expectedOutput: `Hipotenuza: 5.0`,
      hint: "Koristi math.sqrt() i stepenovanje sa **. Formula: math.sqrt(a**2 + b**2).",
      check: (code) =>
        code.includes("importmath") &&
        code.includes("math.sqrt(") &&
        code.includes("**2") &&
        code.includes("print("),
    },
    {
      redoslijed: 8,
      title: "Simulacija bacanja kockice",
      description:
        "Uvezi random modul. Simuliraj bacanje kockice (brojevi 1-6) i ispiši rezultat 5 puta koristeći petlju.",
      solution: `import random

for i in range(5):
    print(random.randint(1, 6))`,
      expectedOutput: `(5 slučajnih brojeva između 1 i 6)`,
      hint: "Koristi for petlju sa range(5) i unutar nje random.randint(1, 6).",
      check: (code) =>
        code.includes("importrandom") &&
        code.includes("random.randint(1,6)") &&
        code.includes("for") &&
        code.includes("print("),
    },
  ],
};

export default moduli;

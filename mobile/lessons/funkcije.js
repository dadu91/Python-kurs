const funkcije = {
  badge: "Lekcija 7",
  title: "Funkcije u Pythonu",
  heroClass: "functions-hero",
  description:
    "U ovoj lekciji učiš šta su funkcije, kako se prave i zašto su korisne — jednom napišeš, koristiš koliko god puta hoćeš.",
  duration: "35 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je funkcija i zašto je koristimo", blockIndex: 0 },
    { tekst: "Znaš kako se prosljeđuju parametri funkciji", blockIndex: 1 },
    { tekst: "Znaš šta je return i kako se koristi", blockIndex: 2 },
    { tekst: "Znaš kako pozvati funkciju više puta sa različitim podacima", blockIndex: 3 },
  ],

  theoryBlocks: [
    {
      title: "Šta je funkcija?",
      text: "Funkcija je kao recept — jednom ga napišeš, a koristiš ga koliko god puta hoćeš. Umjesto da ponavljaš isti kod, staviš ga u funkciju i pozoveš je po imenu kad ti zatreba.",
      code: `def pozdravi():
    print("Zdravo!")

pozdravi()
pozdravi()
pozdravi()`,
      codeObjasnjenje: [
        "def pozdravi() — definišemo funkciju pod imenom 'pozdravi'",
        "print('Zdravo!') — ovaj kod se izvršava svaki put kad pozovemo funkciju",
        "pozdravi() — pozivamo funkciju, izvršava se kod unutar nje",
        "Pozvali smo je 3 puta — ispisuje 'Zdravo!' tri puta",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi funkciju 'pokreni' koja ispisuje 'Program je pokrenut!', pa je pozovi.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: def pokreni():, print('Program je pokrenut!') i poziv pokreni().",
        check: (code) =>
          code.includes("defpokreni()") &&
          code.includes("programjepokrenut") &&
          code.includes("pokreni()"),
      },
    },
    {
      title: "Parametri",
      text: "Parametri su vrijednosti koje proslijedimo funkciji kada je pozovemo. Tako ista funkcija može raditi sa različitim podacima svaki put.",
      code: `def pozdravi(ime):
    print("Zdravo,", ime)

pozdravi("Ana")
pozdravi("Marko")
pozdravi("Sara")`,
      codeObjasnjenje: [
        "def pozdravi(ime) — funkcija prima jedan parametar koji se zove 'ime'",
        "print('Zdravo,', ime) — ispisuje 'Zdravo,' i vrijednost parametra",
        "pozdravi('Ana') — šaljemo 'Ana' kao vrijednost parametra ime",
        "Svaki poziv ispisuje drugačije ime, a kod je uvijek isti",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi funkciju 'ispisi_grad' koja prima parametar 'grad' i ispisuje ga. Pozovi je dva puta — jednom sa 'Podgorica' i jednom sa 'Niksic'.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: def ispisi_grad(grad):, print(grad), ispisi_grad('Podgorica') i ispisi_grad('Niksic').",
        check: (code) =>
          code.includes("defispisi_grad(grad)") &&
          code.includes("print(grad)") &&
          code.includes("podgorica") &&
          code.includes("niksic"),
      },
    },
    {
      title: "return — vraćanje rezultata",
      text: "Funkcija ne mora samo ispisivati — može i da vrati rezultat. Zamisli to ovako: pitaš nekoga koliko je sati, on ti odgovori '14:30' — taj odgovor možeš zapamtiti i koristiti dalje. Isto radi return. Rezultat funkcije možeš smjestiti u promjenljivu i koristiti ga gdje god hoćeš.",
      code: `def saberi(a, b):
    return a + b

rezultat = saberi(3, 5)
print(rezultat)`,
      codeObjasnjenje: [
        "def saberi(a, b) — funkcija prima dva parametra: a i b",
        "return a + b — vraća zbir, ne ispisuje ga",
        "rezultat = saberi(3, 5) — pozivamo funkciju i čuvamo ono što vrati",
        "print(rezultat) — tek ovdje ispisujemo, ispisuje 8",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi funkciju 'pomnozi' koja prima dva parametra 'a' i 'b', i vraća njihov proizvod. Pozovi je sa 4 i 5 i ispiši rezultat.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: def pomnozi(a, b):, return a * b, rezultat = pomnozi(4, 5) i print(rezultat).",
        check: (code) =>
          code.includes("defpomnozi(a,b)") &&
          code.includes("returna*b") &&
          code.includes("print("),
      },
    },
    {
      title: "Pozivanje funkcije više puta",
      text: "Najveća prednost funkcija je što ih možeš pozvati više puta sa različitim vrijednostima. Kod pišeš jednom, a koristiš ga beskonačno — to štedi vrijeme i smanjuje greške.",
      code: `def pozdrav(ime, grad):
    print("Zdravo", ime + "!", "Jesi li iz", grad + "?")

pozdrav("Ana", "Podgorice")
pozdrav("Marko", "Nikšića")
pozdrav("Sara", "Bara")`,
      codeObjasnjenje: [
        "def pozdrav(ime, grad) — funkcija prima dva parametra",
        "print(...) — kombinuje oba parametra u jednu rečenicu",
        "Pozivamo je 3 puta sa različitim imenima i gradovima",
        "Isti kod, različiti podaci — to je snaga funkcija",
      ],
      vjezbaSintakse: null,
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Koja ključna riječ se koristi za pravljenje funkcije?",
      answers: ["func", "def", "function"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Kako se zovu vrijednosti koje proslijedimo funkciji?",
      answers: ["Varijable", "Parametri", "Rezultati"],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Šta radi return?",
      answers: ["Ispisuje vrijednost", "Vraća vrijednost iz funkcije", "Pokreće funkciju"],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Koliko puta možemo pozvati istu funkciju?",
      answers: ["Jednom", "Dva puta", "Koliko god puta hoćemo"],
      correct: 2,
    },
    {
      redoslijed: 6,
      question: "Šta će ispisati: def f(): print('Hi') — bez poziva?",
      answers: ["Hi", "Ništa", "Grešku"],
      correct: 1,
    },
    {
      redoslijed: 7,
      question: "Koja je razlika između print() i return unutar funkcije?",
      answers: [
        "Nema razlike",
        "print ispisuje, return vraća vrijednost koja se može koristiti dalje",
        "return ispisuje, print vraća vrijednost",
      ],
      correct: 1,
    },
  ],

  codingTasks: [
    {
      redoslijed: 8,
      title: "Kvadrat broja",
      description:
        "Napiši funkciju 'kvadrat' koja prima jedan parametar 'broj' i vraća taj broj na kvadrat (broj * broj). Pozovi je sa proizvoljnom vrijednošću i ispiši rezultat.",
      solution: `def kvadrat(broj):
    return broj * broj

rezultat = kvadrat(5)
print(rezultat)`,
      expectedOutput: `25`,
      hint: "Funkcija treba da koristi return, ne print. Rezultat čuvaj u promjenljivoj pa ispiši.",
      check: (code) =>
        code.includes("defkvadrat(broj)") &&
        (code.includes("returnbroj*broj") || code.includes("returnbroj**2")) &&
        code.includes("kvadrat(") &&
        code.includes("print("),
    },
    {
      redoslijed: 9,
      title: "Izračunaj popust",
      description:
        "Napiši funkciju 'popust' koja prima dva parametra: 'cijena' i 'procenat'. Funkcija treba da vrati cijenu nakon odbitka popusta — procenat se izračunava kao (cijena * procenat / 100). Pozovi je nekoliko puta sa različitim vrijednostima i ispiši rezultate.",
      solution: `def popust(cijena, procenat):
    return cijena - (cijena * procenat / 100)

print(popust(200, 10))
print(popust(500, 20))
print(popust(80, 50))`,
      expectedOutput: `180.0\n400.0\n40.0`,
      hint: "Formula za popust je: cijena - (cijena * procenat / 100). Funkcija vraća rezultat, a ti ga ispisuj direktno u print.",
      check: (code) =>
        code.includes("defpopust(cijena,procenat)") &&
        code.includes("return") &&
        code.includes("procenat/100") &&
        code.includes("print(popust("),
    },
  ],
};

export default funkcije;

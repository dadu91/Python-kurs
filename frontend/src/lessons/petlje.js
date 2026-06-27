const petlje = {
  badge: "Lekcija 4",
  title: "Petlje u Pythonu",
  heroClass: "loops-hero",
  description:
    "U ovoj lekciji učiš kako rade for i while petlje, kako se koristi range(), kako se prolazi kroz listu i kako da izbjegneš najčešće greške u petljama.",
  duration: "45 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ kako radi while petlja", blockIndex: 1 },
    { tekst: "Razumiješ kako radi for petlja", blockIndex: 2 },
    { tekst: "Znaš kako se koristi range()", blockIndex: 2 },
    { tekst: "Znaš kako se petljom prolazi kroz listu", blockIndex: 3 },
    { tekst: "Umiješ da pronađeš grešku u kodu sa petljama", blockIndex: 4 },
  ],

  theoryBlocks: [
    {
      title: "Šta su petlje?",
      text: "Petlje koristimo kada želimo da se neki dio koda ponovi više puta. Umjesto da istu naredbu pišemo ručno više puta, napišemo petlju koja to radi za nas.",
      code: `x = 0
while x < 5:
    print(x)
    x += 1

# Ispisuje: 0 1 2 3 4`,
      codeObjasnjenje: [
        "x = 0 — postavljamo brojač na početnu vrijednost",
        "while x < 5 — petlja se vrti sve dok je x manji od 5",
        "print(x) — ispisuje trenutnu vrijednost x",
        "x += 1 — povećavamo x za 1, inače bi se petlja vrtila beskonačno",
      ],
      vjezbaSintakse: null,
    },
    {
      title: "while petlja",
      text: "While petlja se ponavlja sve dok je uslov tačan. Moraš ručno kontrolisati promjenljivu koja mijenja uslov — inače se petlja nikad ne završava.",
      code: `x = 0
while x < 3:
    print("Python")
    x += 1

# Ispisuje Python 3 puta`,
      codeObjasnjenje: [
        "x = 0 — postavljamo brojač na 0",
        "while x < 3 — petlja se vrti dok je x manji od 3",
        "print(\"Python\") — ispisuje tekst Python",
        "x += 1 — povećavamo x za 1 nakon svakog ponavljanja",
      ],
      vjezbaSintakse: {
        uputstvo: "Napiši while petlju koja ispisuje brojeve od 1 do 5. Koristi promjenljivu broj = 1 i povećavaj je za 1 sve dok nije veća od 5.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: broj = 1, while broj <= 5:, print(broj) i broj += 1.",
        check: (code) =>
          code.includes("broj=1") &&
          code.includes("while") &&
          code.includes("print(") &&
          (code.includes("broj+=1") || code.includes("broj=broj+1")),
      },
    },
    {
      title: "for petlja i range()",
      text: "For petlja je kraći način da ponavljaš kod kada znaš tačno koliko puta. Funkcija range() generiše niz brojeva umjesto tebe — ne moraš ručno povećavati promjenljivu.",
      code: `for i in range(5):
    print(i)

for i in range(1, 6):
    print(i)

for i in range(10, 0, -2):
    print(i)`,
      codeObjasnjenje: [
        "range(5) — jedan parametar: generiše 0, 1, 2, 3, 4",
        "range(1, 6) — dva parametra: generiše od 1 do 5, kraj se ne uključuje",
        "range(10, 0, -2) — tri parametra: početak, kraj, korak — generiše 10, 8, 6, 4, 2",
        "korak može biti negativan broj za odbrojavanje, ili npr. 2 za svaki drugi broj",
      ],
      vjezbaSintakse: {
        uputstvo: "Napiši for petlju koja ispisuje kvadrate brojeva od 1 do 5. Kvadrat broja dobijamo sa i ** 2.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: for i in range(1, 6): i print(i ** 2).",
        check: (code) =>
          code.includes("for") &&
          code.includes("range(1,6)") &&
          code.includes("**2") &&
          code.includes("print("),
      },
    },
    {
      title: "Prolazak kroz listu",
      text: "For petljom možemo proći kroz svaki element liste direktno — bez indeksa. Ovo je jedan od najčešćih načina korištenja for petlje.",
      code: `voce = ["jabuka", "kruška", "šljiva"]

for v in voce:
    print(v)`,
      codeObjasnjenje: [
        "voce = [...] — definišemo listu sa tri elementa",
        "for v in voce — v uzima svaki element liste redom",
        "print(v) — ispisuje trenutni element: jabuka, pa kruška, pa šljiva",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi listu 'ocjene' sa vrijednostima [2, 4, 5, 3, 1]. Prođi kroz listu i za svaku ocjenu ispiši 'Položio' ako je ocjena veća ili jednaka 2, ili 'Pao' ako nije.",
        initialCode: "ocjene = [2, 4, 5, 3, 1]\n",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: for ocjena in ocjene:, if ocjena >= 2: print(\"Položio\") i else: print(\"Pao\").",
        check: (code) =>
          code.includes("ocjene=[2,4,5,3,1]") &&
          code.includes("for") &&
          code.includes("inocjene:") &&
          code.includes("if") &&
          code.includes(">=2") &&
          code.includes("else") &&
          code.includes("položio") &&
          code.includes("pao") &&
          code.includes("print("),
      },
    },
    {
      title: "Najčešće greške kod petlji",
      text: "Početnici često zaborave dvotačku na kraju for/while linije, pogriješe uvlačenje koda (indentation) ili naprave while petlju koja se nikad ne završava jer zaborave povećati promjenljivu.",
      code: `for i in range(5)
    print(i)

for i in range(5):
    print(i)`,
      codeObjasnjenje: [
        "for i in range(5) — fali dvotačka na kraju, Python javlja grešku",
        "for i in range(5): — ispravno, dvotačka označava početak bloka koda",
        "print(i) — mora biti uvučeno (4 razmaka) da pripada petlji, inače Python ne zna šta je unutar petlje",
      ],
      vjezbaSintakse: {
        uputstvo: "Ispravi grešku u ovom kodu — while petlja se nikad ne završava jer nešto fali:",
        initialCode: `x = 0\nwhile x < 4:\n    print(x)\n`,
        placeholder: "Ovdje upiši ispravan kod...",
        hint: "Fali x += 1 unutar petlje — bez toga x ostaje 0 zauvijek.",
        check: (code) =>
          code.includes("while") &&
          (code.includes("x+=1") || code.includes("x=x+1")) &&
          code.includes("print("),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question:
        "Koja petlja se najčešće koristi kada znamo koliko puta nešto ponavljamo?",
      answers: ["for", "while", "if"],
      correct: 0,
    },
    {
      redoslijed: 3,
      question: "Šta će ispisati kod: for i in range(3): print(i)?",
      answers: ["1 2 3", "0 1 2", "0 1 2 3"],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Koja petlja se koristi kada ponavljanje zavisi od uslova?",
      answers: ["for", "while", "print"],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Šta fali u ovom kodu: for i in range(5) print(i)?",
      answers: ["Dvotačka poslije range(5)", "Navodnici", "Promjenljiva x"],
      correct: 0,
    },
    {
      redoslijed: 6,
      question: "Šta radi naredba x += 1 u while petlji?",
      answers: ["Smanjuje x za 1", "Povećava x za 1", "Prekida program"],
      correct: 1,
    },
    {
      redoslijed: 7,
      question:
        "Šta može da se desi ako u while petlji nikad ne promijenimo uslov?",
      answers: [
        "Petlja se nikad ne završava",
        "Program se odmah gasi",
        "Python automatski popravi grešku",
      ],
      correct: 0,
    },
    {
      redoslijed: 8,
      question: "Kako provjeravamo da li je broj paran?",
      answers: ["broj % 2 == 0", "broj / 2 == 0", "broj + 2 == 0"],
      correct: 0,
    },
  ],

  codingTasks: [
    {
      redoslijed: 9,
      title: "Tablica množenja",
      description:
        "Napiši program koji koristeći for petlju i range() ispisuje tablicu množenja za broj 5 — od 5x1 do 5x10. Izlaz treba izgledati ovako:\n5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n...\n5 x 10 = 50",
      solution: `for i in range(1, 11):
    print("5 x", i, "=", 5 * i)`,
      expectedOutput: `5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50`,
      hint: "Treba ti: for i in range(1, 11): i print(\"5 *\", i, \"=\", 5 * i).",
      check: (code) =>
        code.includes("for") &&
        code.includes("range(1,11)") &&
        code.includes("5*i") &&
        code.includes("print("),
    },
    {
      redoslijed: 10,
      title: "Parno ili neparno",
      description:
        "Data ti je lista brojevi = [3, 8, 15, 22, 37, 44]. Prođi kroz listu i za svaki broj ispiši da li je parno ili neparno, npr:\n3 - Neparno\n8 - Parno",
      solution: `brojevi = [3, 8, 15, 22, 37, 44]

for broj in brojevi:
    if broj % 2 == 0:
        print(broj, "- Parno")
    else:
        print(broj, "- Neparno")`,
      expectedOutput: `3 - Neparno\n8 - Parno\n15 - Neparno\n22 - Parno\n37 - Neparno\n44 - Parno`,
      hint: "Treba ti for petlja, if broj % 2 == 0 za provjeru parnosti i else za neparno.",
      initialCode: "brojevi = [3, 8, 15, 22, 37, 44]\n",
      check: (code) =>
        code.includes("brojevi") &&
        code.includes("for") &&
        code.includes("%2==0") &&
        code.includes("else") &&
        code.includes("parno") &&
        code.includes("neparno") &&
        code.includes("print("),
    },
    {
      redoslijed: 11,
      title: "Odbrojavanje",
      description:
        "Napiši program koji odbroji od 10 do 1 koristeći for petlju i range() sa tri parametra, pa ispiši \"Kraj!\". Izlaz treba izgledati ovako:\n10\n9\n8\n...\n1\nKraj!",
      solution: `for i in range(10, 0, -1):
    print(i)

print("Kraj!")`,
      expectedOutput: `10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nKraj!`,
      hint: "Treba ti: for i in range(10, 0, -1): i print(i), pa print(\"Kraj!\") van petlje.",
      check: (code) =>
        code.includes("range(10,0,-1)") &&
        code.includes("print(i)") &&
        code.includes("kraj!"),
    },
  ],
};

export default petlje;

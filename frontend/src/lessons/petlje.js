const petlje = {
  badge: "Lekcija 2",
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
        uputstvo: 'Napiši while petlju koja ispisuje "Python" 3 puta. Koristi promjenljivu x = 0 i povećavaj je za 1.',
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: x = 0, while x < 3:, print(...) i x += 1.",
        check: (code) =>
          code.includes("x=0") &&
          code.includes("whilex<3:") &&
          code.includes("print(") &&
          code.includes("x+=1"),
      },
    },
    {
      title: "for petlja i range()",
      text: "For petlja je kraći način da ponavljaš kod kada znaš tačno koliko puta. Funkcija range() generiše niz brojeva umjesto tebe — ne moraš ručno povećavati promjenljivu.",
      code: `for i in range(5):
    print(i)

# Ispisuje: 0 1 2 3 4

for i in range(1, 6):
    print(i)

# Ispisuje: 1 2 3 4 5`,
      codeObjasnjenje: [
        "for i in range(5) — i uzima vrijednosti 0, 1, 2, 3, 4 redom",
        "print(i) — ispisuje trenutnu vrijednost i",
        "range(1, 6) — generiše brojeve od 1 do 5, kraj se ne uključuje",
      ],
      vjezbaSintakse: {
        uputstvo: "Napiši for petlju koja koristi range(1, 6) i ispisuje vrijednost i.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: for i in range(1, 6): i ispod print(i).",
        check: (code) =>
          code.includes("foriinrange(1,6):") && code.includes("print(i)"),
      },
    },
    {
      title: "Prolazak kroz listu",
      text: "For petljom možemo proći kroz svaki element liste direktno — bez indeksa. Ovo je jedan od najčešćih načina korištenja for petlje.",
      code: `voce = ["jabuka", "kruška", "šljiva"]

for v in voce:
    print(v)

# Ispisuje:
# jabuka
# kruška
# šljiva`,
      codeObjasnjenje: [
        "voce = [...] — definišemo listu sa tri elementa",
        "for v in voce — v uzima svaki element liste redom",
        "print(v) — ispisuje trenutni element",
      ],
      vjezbaSintakse: {
        uputstvo: 'Data je lista voce = ["jabuka", "kruška", "šljiva"]. Napiši for petlju koja prolazi kroz listu i ispisuje svaki element.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: voce = [...], for v in voce: i ispod print(v).',
        check: (code) =>
          code.includes("voce=") &&
          code.includes("forvinvoce:") &&
          code.includes("print(v)"),
      },
    },
    {
      title: "Najčešće greške kod petlji",
      text: "Početnici često zaborave dvotačku na kraju for/while linije, pogriješe uvlačenje koda (indentation) ili naprave while petlju koja se nikad ne završava jer zaborave povećati promjenljivu.",
      code: `# Greška: fali dvotačka
for i in range(5)
    print(i)

# Ispravno:
for i in range(5):
    print(i)`,
      codeObjasnjenje: [
        "for i in range(5) — fali dvotačka na kraju, Python ne zna gdje počinje tijelo petlje",
        "for i in range(5): — ispravno, dvotačka označava početak bloka koda",
        "print(i) — mora biti uvučeno (4 razmaka) da pripada petlji",
      ],
      vjezbaSintakse: {
        uputstvo: "Ispravi grešku — napiši tačan kod: for i in range(5) print(i)",
        placeholder: "Ovdje upiši ispravan kod...",
        hint: "Poslije range(5) mora stajati dvotačka, a print(i) mora biti uvučen.",
        check: (code) =>
          code.includes("foriinrange(5):") && code.includes("print(i)"),
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
      title: "Zadatak 1: Prođi kroz listu brojeva",
      description:
        "Data je lista brojeva: brojevi = [2, 4, 6, 8]. Napiši program koji pomoću for petlje prolazi kroz listu i ispisuje svaki broj.",
      solution: `brojevi = [2, 4, 6, 8]

for broj in brojevi:
    print(broj)`,
      expectedOutput: `2
4
6
8`,
      hint: "Treba ti lista brojevi = [2, 4, 6, 8], for broj in brojevi i print(broj).",
      check: (code) =>
        code.includes("brojevi=[2,4,6,8]") &&
        code.includes("forbrojinbrojevi:") &&
        code.includes("print(broj)"),
    },
    {
      redoslijed: 10,
      title: "Zadatak 2: Ispiši samo parne brojeve",
      description:
        "Data je lista brojeva: brojevi = [10, 15, 22, 31, 44, 57, 68]. Napiši program koji pomoću for petlje prolazi kroz listu i ispisuje samo parne brojeve.",
      solution: `brojevi = [10, 15, 22, 31, 44, 57, 68]

for broj in brojevi:
    if broj % 2 == 0:
        print(broj)`,
      expectedOutput: `10
22
44
68`,
      hint: "Treba ti for petlja, if uslov za parnost (% 2 == 0) i print(broj).",
      check: (code) =>
        code.includes("brojevi=[10,15,22,31,44,57,68]") &&
        code.includes("forbrojinbrojevi:") &&
        code.includes("ifbroj%2==0:") &&
        code.includes("print(broj)"),
    },
    {
      redoslijed: 11,
      title: "Zadatak 3: Prebroj parne brojeve (while petlja)",
      description:
        "Data je lista brojeva: brojevi = [12, 19, 24, 33, 40, 55, 72, 81]. Napiši program koji koristi while petlju da prođe kroz listu, broji parne brojeve i na kraju ispisuje njihov broj.",
      solution: `brojevi = [12, 19, 24, 33, 40, 55, 72, 81]
brojac = 0
i = 0

while i < len(brojevi):
    if brojevi[i] % 2 == 0:
        brojac += 1
    i += 1

print(brojac)`,
      expectedOutput: `4`,
      hint: "Treba ti: i = 0, while i < len(brojevi):, provjera parnosti, brojac += 1, i += 1 i print(brojac).",
      check: (code) =>
        code.includes("brojevi=[12,19,24,33,40,55,72,81]") &&
        code.includes("brojac=0") &&
        code.includes("i=0") &&
        code.includes("whilei<len(brojevi):") &&
        code.includes("ifbrojevi[i]%2==0:") &&
        code.includes("brojac+=1") &&
        code.includes("i+=1") &&
        code.includes("print("),
    },
  ],
};

export default petlje;

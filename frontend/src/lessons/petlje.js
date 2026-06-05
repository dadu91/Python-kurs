const petlje = {
  badge: "Lekcija 2",
  title: "Petlje u Pythonu",
  heroClass: "loops-hero",
  description:
    "U ovoj lekciji učiš kako rade for i while petlje, kako se koristi range(), kako se prolazi kroz listu i kako da prepoznaš najčešće greške u petljama.",
  duration: "45 min",
  level: "Početnik",

  goals: [
    "Razumiješ kako radi for petlja",
    "Znaš kako se koristi range()",
    "Razlikuješ for i while petlju",
    "Umiješ da pronađeš grešku u kodu sa petljama",
    "Znaš kako se petljom prolazi kroz listu",
  ],

  theoryBlocks: [
    {
      title: "Šta su petlje?",
      text: "Petlje koristimo kada želimo da se neki dio koda ponovi više puta. Umjesto da istu naredbu pišemo ručno više puta, napišemo petlju koja to radi za nas.",
      code: `for i in range(5):
    print(i)

# Ispisuje: 0 1 2 3 4`,
      vjezbaSintakse: {
        uputstvo: "Napiši for petlju koja koristi range(3) i ispisuje vrijednost i.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: for i in range(3): i ispod print(i).",
        check: (code) =>
          code.includes("foriinrange(3):") && code.includes("print(i)"),
      },
    },
    {
      title: "for petlja i range()",
      text: "Funkcija range() generiše niz brojeva. Možeš zadati početak, kraj i korak: range(početak, kraj, korak). Kraj se ne uključuje u niz.",
      code: `for i in range(1, 6):
    print(i)

# Ispisuje: 1 2 3 4 5

for i in range(0, 10, 2):
    print(i)

# Ispisuje: 0 2 4 6 8`,
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
      text: "For petljom možemo proći kroz svaki element liste. Umjesto indeksa, direktno dobijamo vrijednost elementa.",
      code: `voce = ["jabuka", "kruška", "šljiva"]

for v in voce:
    print(v)

# Ispisuje:
# jabuka
# kruška
# šljiva`,
      vjezbaSintakse: {
        uputstvo: 'Data je lista voce = ["jabuka", "kruška", "šljiva"]. Napiši for petlju koja prolazi kroz listu i ispisuje svaki element.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: voce = [...], for v in voce: i ispod print(v).',
        check: (code) =>
          code.includes("voce=") &&
          code.includes("forvuvoce:") &&
          code.includes("print(v)"),
      },
    },
    {
      title: "while petlja",
      text: "While petlja se ponavlja sve dok je uslov tačan. Mora da postoji nešto što mijenja uslov, inače se petlja nikad ne završava.",
      code: `x = 0
while x < 3:
    print("Python")
    x += 1

# Ispisuje Python 3 puta`,
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
      title: "Najčešće greške kod petlji",
      text: "Početnici često zaborave dvotačku na kraju for/while linije, pogriješe uvlačenje koda (indentation) ili naprave while petlju koja se nikad ne završava jer zaborave povećati promjenljivu.",
      code: `# Greška: fali dvotačka
for i in range(5)
    print(i)

# Ispravno:
for i in range(5):
    print(i)`,
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
      question:
        "Koja petlja se najčešće koristi kada znamo koliko puta nešto ponavljamo?",
      answers: ["for", "while", "if"],
      correct: 0,
    },
    {
      question: "Šta će ispisati kod: for i in range(3): print(i)?",
      answers: ["1 2 3", "0 1 2", "0 1 2 3"],
      correct: 1,
    },
    {
      question: "Koja petlja se koristi kada ponavljanje zavisi od uslova?",
      answers: ["for", "while", "print"],
      correct: 1,
    },
    {
      question: "Šta fali u ovom kodu: for i in range(5) print(i)?",
      answers: ["Dvotačka poslije range(5)", "Navodnici", "Promjenljiva x"],
      correct: 0,
    },
    {
      question:
        "Koja greška se najčešće dobija ako kod unutar petlje nije pravilno uvučen?",
      answers: ["NameError", "IndentationError", "ValueError"],
      correct: 1,
    },
    {
      question: "Šta radi naredba x += 1 u while petlji?",
      answers: ["Smanjuje x za 1", "Povećava x za 1", "Prekida program"],
      correct: 1,
    },
    {
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
      question: "Kako provjeravamo da li je broj paran?",
      answers: ["broj % 2 == 0", "broj / 2 == 0", "broj + 2 == 0"],
      correct: 0,
    },
  ],

  codingTasks: [
    {
      title: "Mini zadatak 1: Ispiši brojeve od 0 do 4",
      description:
        "Napiši for petlju koja koristi range(5) i ispisuje svaki broj od 0 do 4.",
      solution: `for i in range(5):
    print(i)`,
      expectedOutput: `0
1
2
3
4`,
      hint: "Treba ti for petlja, range(5) i print(i).",
      check: (code) =>
        code.includes("foriinrange(5):") && code.includes("print(i)"),
    },
    {
      title: "Mini zadatak 2: Prođi kroz listu brojeva",
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
      title: "Mini zadatak 3: Ispiši samo parne brojeve",
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
      hint: "Provjeri listu, for petlju, uslov za paran broj i ispis.",
      check: (code) =>
        code.includes("brojevi=[10,15,22,31,44,57,68]") &&
        code.includes("forbrojinbrojevi:") &&
        code.includes("ifbroj%2==0:") &&
        code.includes("print(broj)"),
    },
    {
      title: "Mini zadatak 4: Prebroj parne brojeve",
      description:
        "Data je lista brojeva: brojevi = [12, 19, 24, 33, 40, 55, 72, 81]. Napiši program koji broji koliko parnih brojeva ima u listi i na kraju ispisuje vrijednost brojača.",
      solution: `brojevi = [12, 19, 24, 33, 40, 55, 72, 81]
brojac = 0

for broj in brojevi:
    if broj % 2 == 0:
        brojac += 1

print(brojac)`,
      expectedOutput: `4`,
      hint: "Provjeri listu, brojač, for petlju, if uslov, povećanje brojača i print.",
      check: (code) =>
        code.includes("brojevi=[12,19,24,33,40,55,72,81]") &&
        code.includes("brojac=0") &&
        code.includes("forbrojinbrojevi:") &&
        code.includes("ifbroj%2==0:") &&
        code.includes("brojac+=1") &&
        code.includes("print("),
    },
    {
      title: "Mini zadatak 5: Pronađi i ispravi grešku",
      description:
        "U kodu ispod fali dvotačka poslije range(5). Napiši ispravan kod koji ispisuje brojeve od 0 do 4: for i in range(5) print(i).",
      solution: `for i in range(5):
    print(i)`,
      expectedOutput: `0
1
2
3
4`,
      hint: "Poslije for i in range(5) mora da stoji dvotačka.",
      check: (code) =>
        code.includes("foriinrange(5):") && code.includes("print(i)"),
    },
  ],
};

export default petlje;

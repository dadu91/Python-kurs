const liste = {
  badge: "Lekcija 3",
  title: "Liste u Pythonu",
  heroClass: "lists-hero",
  description:
    "U ovoj lekciji učiš šta su liste, kako se prave, kako pristupamo elementima, kako dodajemo i mijenjamo vrijednosti i kako prolazimo kroz listu pomoću petlje.",
  duration: "45 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je lista u Pythonu", blockIndex: 0 },
    { tekst: "Znaš kako se pravi lista", blockIndex: 0 },
    { tekst: "Umiješ da pristupiš elementu liste pomoću indeksa", blockIndex: 1 },
    { tekst: "Znaš kako se dodaje novi element u listu", blockIndex: 2 },
    { tekst: "Znaš kako se prolazi kroz listu pomoću for petlje", blockIndex: 4 },
    { tekst: "Umiješ da koristiš len() i sum() nad listom brojeva", blockIndex: 4 },
  ],

  theoryBlocks: [
    {
      title: "Šta su liste?",
      text: "Lista je struktura podataka koja čuva više vrijednosti u jednoj promjenljivoj. U listu možemo staviti brojeve, tekstove ili druge podatke.",
      code: `brojevi = [10, 20, 30, 40]

print(brojevi)

# Ispisuje:
# [10, 20, 30, 40]`,
      vjezbaSintakse: {
        uputstvo:
          "Napravi listu brojevi sa vrijednostima 5, 10 i 15, zatim ispiši cijelu listu.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: brojevi = [5, 10, 15] i print(brojevi).",
        check: (code) =>
          code.includes("brojevi=[5,10,15]") &&
          code.includes("print(brojevi)"),
      },
    },
    {
      title: "Indeksi u listi",
      text: "Svaki element liste ima svoj indeks. Indeksi počinju od 0. To znači da je prvi element na indeksu 0, drugi na indeksu 1 i tako dalje.",
      code: `voce = ["jabuka", "banana", "kruška"]

print(voce[0])
print(voce[1])

# Ispisuje:
# jabuka
# banana`,
      vjezbaSintakse: {
        uputstvo:
          'Data je lista voce = ["jabuka", "banana", "kruška"]. Ispiši prvi element liste.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti lista voce = [...] i print(voce[0]).',
        check: (code) =>
          code.includes('voce=["jabuka","banana","kruška"]') &&
          code.includes("print(voce[0])"),
      },
    },
    {
      title: "Dodavanje elemenata u listu",
      text: "Metoda append() dodaje novi element na kraj liste. To je korisno kada tokom programa želimo da proširimo listu.",
      code: `imena = ["Ana", "Marko"]

imena.append("Petar")

print(imena)

# Ispisuje:
# ['Ana', 'Marko', 'Petar']`,
      vjezbaSintakse: {
        uputstvo:
          'Napravi listu imena = ["Ana", "Marko"], dodaj ime "Petar" pomoću append() i ispiši listu.',
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: imena = ["Ana", "Marko"], imena.append("Petar") i print(imena).',
        check: (code) =>
          code.includes('imena=["ana","marko"]') &&
          code.includes('imena.append("petar")') &&
          code.includes("print(imena)"),
      },
    },
    {
      title: "Mijenjanje elemenata liste",
      text: "Element liste možemo promijeniti tako što preko indeksa dodijelimo novu vrijednost.",
      code: `ocjene = [3, 4, 5]

ocjene[0] = 5

print(ocjene)

# Ispisuje:
# [5, 4, 5]`,
      vjezbaSintakse: {
        uputstvo:
          "Data je lista ocjene = [2, 4, 5]. Promijeni prvi element u 5 i ispiši listu.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: ocjene = [2, 4, 5], ocjene[0] = 5 i print(ocjene).",
        check: (code) =>
          code.includes("ocjene=[2,4,5]") &&
          code.includes("ocjene[0]=5") &&
          code.includes("print(ocjene)"),
      },
    },
    {
      title: "Prolazak kroz listu",
      text: "Kroz listu najčešće prolazimo pomoću for petlje. Petlja redom uzima svaki element liste.",
      code: `brojevi = [2, 4, 6, 8]

for broj in brojevi:
    print(broj)

# Ispisuje:
# 2
# 4
# 6
# 8`,
      vjezbaSintakse: {
        uputstvo:
          "Data je lista brojevi = [1, 2, 3]. Napiši for petlju koja ispisuje svaki broj iz liste.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: brojevi = [1, 2, 3], for broj in brojevi: i print(broj).",
        check: (code) =>
          code.includes("brojevi=[1,2,3]") &&
          code.includes("forbrojinbrojevi:") &&
          code.includes("print(broj)"),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Šta je lista u Pythonu?",
      answers: [
        "Promjenljiva koja čuva samo jedan broj",
        "Struktura koja može čuvati više vrijednosti",
        "Naredba za ispis",
      ],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Kojim zagradama se najčešće pišu liste?",
      answers: ["()", "{}", "[]"],
      correct: 2,
    },
    {
      redoslijed: 4,
      question: "Koji je indeks prvog elementa u listi?",
      answers: ["0", "1", "-1"],
      correct: 0,
    },
    {
      redoslijed: 5,
      question: `Šta će ispisati kod:\nvoce = ['jabuka', 'banana']\nprint(voce[1])?`,
      answers: ["jabuka", "banana", "Grešku"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: "Koja metoda dodaje element na kraj liste?",
      answers: ["add()", "append()", "print()"],
      correct: 1,
    },
    {
      redoslijed: 7,
      question: "Šta radi len(lista)?",
      answers: [
        "Vraća broj elemenata u listi",
        "Briše listu",
        "Dodaje novi element",
      ],
      correct: 0,
    },
    {
      redoslijed: 8,
      question: "Kako prolazimo kroz sve elemente liste?",
      answers: [
        "Pomoću for petlje",
        "Samo pomoću print()",
        "Pomoću navodnika",
      ],
      correct: 0,
    },
    {
      redoslijed: 9,
      question: "Šta radi sum([2, 3, 5])?",
      answers: ["Vraća 10", "Vraća 3", "Vraća [2, 3, 5]"],
      correct: 0,
    },
  ],

  codingTasks: [
    {
      redoslijed: 10,
      title: "Mini zadatak 1: Napravi i ispiši listu",
      description:
        "Napravi listu brojevi = [3, 6, 9, 12] i ispiši cijelu listu.",
      solution: `brojevi = [3, 6, 9, 12]

print(brojevi)`,
      expectedOutput: `[3, 6, 9, 12]`,
      hint: "Treba ti lista brojevi = [3, 6, 9, 12] i print(brojevi).",
      check: (code) =>
        code.includes("brojevi=[3,6,9,12]") &&
        code.includes("print(brojevi)"),
    },
    {
      redoslijed: 11,
      title: "Mini zadatak 2: Izračunaj zbir elemenata",
      description:
        "Data je lista brojevi = [10, 20, 30, 40]. Izračunaj zbir svih elemenata i ispiši rezultat.",
      solution: `brojevi = [10, 20, 30, 40]

zbir = sum(brojevi)

print(zbir)`,
      expectedOutput: `100`,
      hint: "Možeš koristiti sum(brojevi), pa rezultat ispisati.",
      check: (code) =>
        code.includes("brojevi=[10,20,30,40]") &&
        (code.includes("sum(brojevi)") || (code.includes("zbir") && code.includes("+=") && code.includes("print("))) &&
        code.includes("print("),
    },
    {
      redoslijed: 12,
      title: "Mini zadatak 3: Ispiši brojeve veće od 10",
      description:
        "Data je lista brojevi = [4, 12, 7, 18, 25, 3]. Pomoću for petlje ispiši samo brojeve koji su veći od 10.",
      solution: `brojevi = [4, 12, 7, 18, 25, 3]

for broj in brojevi:
    if broj > 10:
        print(broj)`,
      expectedOutput: `12
18
25`,
      hint: "Treba ti for petlja i uslov if broj > 10.",
      check: (code) =>
        code.includes("brojevi=[4,12,7,18,25,3]") &&
        code.includes("forbrojinbrojevi:") &&
        code.includes("ifbroj>10:") &&
        code.includes("print(broj)"),
    },
  ],
};

export default liste;
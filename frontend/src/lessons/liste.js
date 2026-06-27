const liste = {
  badge: "Lekcija 5",
  title: "Liste u Pythonu",
  heroClass: "lists-hero",
  description:
    "U ovoj lekciji učiš šta su liste, kako se prave i kako se koriste. U jednoj listi mogu biti različiti tipovi podataka — brojevi, tekst i mnogo više.",
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
      text: "Lista je struktura podataka koja čuva više vrijednosti u jednoj promjenljivoj. U listu možemo staviti brojeve, tekstove ili kombinaciju različitih tipova podataka.",
      code: `brojevi = [10, 20, 30, 40]
mjesovita = [1, "Ana", True, 3.14]

print(brojevi)
print(mjesovita)`,
      codeObjasnjenje: [
        "[10, 20, 30, 40] — lista sa četiri broja",
        "[1, \"Ana\", True, 3.14] — lista sa različitim tipovima: int, string, bool, float",
        "print(brojevi) — ispisuje cijelu listu: [10, 20, 30, 40]",
        "print(mjesovita) — ispisuje: [1, 'Ana', True, 3.14]",
      ],
      vjezbaSintakse: {
        uputstvo:
          "Napravi listu 'profil' koja sadrži tvoje ime (string), tvoje godine (int) i da li si student (True ili False). Ispiši listu.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: profil = [\"Ana\", 20, True] i print(profil).",
        check: (code) =>
          code.includes("profil=[") &&
          (code.includes("true") || code.includes("false")) &&
          code.includes("print(profil)"),
      },
    },
    {
      title: "Indeksi u listi",
      text: "Svaki element liste ima svoj indeks. Indeksi počinju od 0 — prvi element je na indeksu 0, drugi na indeksu 1 i tako dalje. Python podržava i negativne indekse: -1 je zadnji element, -2 predzadnji, itd. To je korisno kada ne znaš koliko lista ima elemenata, a trebaš zadnji.",
      code: `voce = ["jabuka", "banana", "kruška", "grožđe"]

print(voce[0])
print(voce[1])
print(voce[-1])
print(voce[-2])`,
      codeObjasnjenje: [
        "voce[0] — prvi element, ispisuje jabuka",
        "voce[1] — drugi element, ispisuje banana",
        "voce[-1] — zadnji element (broji s kraja), ispisuje grožđe",
        "voce[-2] — predzadnji element, ispisuje kruška",
      ],
      vjezbaSintakse: {
        uputstvo:
          "Napravi listu 'dani' sa imenima pet dana u sedmici. Ispiši prvi dan koristeći pozitivan indeks i zadnji dan koristeći negativan indeks.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: dani = [\"Pon\", ...], print(dani[0]) i print(dani[-1]).",
        check: (code) =>
          code.includes("dani") &&
          code.includes("[0]") &&
          code.includes("[-1]") &&
          code.includes("print("),
      },
    },
    {
      title: "Dodavanje elemenata u listu",
      text: "Za razliku od nekih drugih jezika, lista u Pythonu nema fiksnu dužinu — možeš dodavati elemente u bilo kom trenutku tokom programa. Metoda append() dodaje novi element na kraj liste. Možeš pozivati append() koliko god puta hoćeš, lista će rasti sa svakim pozivom.",
      code: `imena = ["Ana", "Marko"]

imena.append("Petar")

print(imena)
print(len(imena))`,
      codeObjasnjenje: [
        "imena = [\"Ana\", \"Marko\"] — lista sa dva elementa",
        "imena.append(\"Petar\") — dodaje \"Petar\" na kraj liste",
        "print(imena) — ispisuje: ['Ana', 'Marko', 'Petar']",
        "print(len(imena)) — ispisuje broj elemenata u listi: 3",
      ],
      vjezbaSintakse: {
        uputstvo:
          "Napravi praznu listu 'korpa'. Dodaj tri namirnice koristeći append() i ispiši koliko artikala imaš u korpi koristeći len().",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: korpa = [], korpa.append(\"...\") tri puta i print(len(korpa)).",
        check: (code) =>
          code.includes("korpa") &&
          (code.match(/append\(/g) || []).length >= 3 &&
          code.includes("len(") &&
          code.includes("print("),
      },
    },
    {
      title: "Mijenjanje elemenata liste",
      text: "Element liste možemo promijeniti tako što preko indeksa dodijelimo novu vrijednost.",
      code: `ocjene = [3, 4, 5]

ocjene[0] = 5

print(ocjene)`,
      codeObjasnjenje: [
        "ocjene = [3, 4, 5] — lista sa tri ocjene",
        "ocjene[0] = 5 — mijenjamo prvi element sa 3 na 5",
        "print(ocjene) — ispisuje: [5, 4, 5]",
      ],
      vjezbaSintakse: {
        uputstvo:
          "Napravi listu 'filmovi' sa tri filma koja voliš. Odlučio si da treći nije baš dobar — zamijeni ga nekim boljim (indeks 2) i ispiši listu.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: filmovi = [\"...\", \"...\", \"...\"], filmovi[2] = \"novi film\" i print(filmovi).",
        check: (code) =>
          code.includes("filmovi=[") &&
          code.includes("filmovi[2]=") &&
          code.includes("print(filmovi)"),
      },
    },
    {
      title: "Korisne funkcije za liste",
      text: "Python ima niz ugrađenih funkcija koje olakšavaju rad sa listama. Možeš sortirati listu, naći najveći ili najmanji element, ukloniti element po vrijednosti ili provjeriti da li nešto postoji u listi koristeći \"in\" i \"not in\".",
      code: `ocjene = [3, 5, 2, 4, 1]

ocjene.sort()
print(ocjene)

print(min(ocjene))
print(max(ocjene))

ocjene.remove(2)
print(ocjene)

print(5 in ocjene)
print(6 not in ocjene)`,
      codeObjasnjenje: [
        "ocjene.sort() — sortira listu od najmanjeg ka najvećem: [1, 2, 3, 4, 5]",
        "min(ocjene) — vraća najmanji element: 1",
        "max(ocjene) — vraća najveći element: 5",
        "ocjene.remove(2) — uklanja element sa vrijednošću 2 iz liste",
        "5 in ocjene — provjerava da li 5 postoji u listi, vraća True ili False",
        "6 not in ocjene — provjerava da li 6 nije u listi, vraća True ili False",
      ],
      vjezbaSintakse: {
        uputstvo:
          "Data ti je lista temperatura. Ispiši najveću i najmanju temperaturu, pa sortiranu listu.",
        initialCode: "temperature = [34, 21, 38, 19, 27]\n",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: max(temperature), min(temperature) i temperature.sort() pa print(temperature).",
        check: (code) =>
          code.includes("temperature") &&
          code.includes("max(") &&
          code.includes("min(") &&
          (code.includes("sort()") || code.includes("sorted(")) &&
          code.includes("print("),
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
      title: "Ispiši brojeve veće od 10",
      description:
        "Data je lista brojevi = [4, 12, 7, 18, 25, 3]. Pomoću for petlje ispiši samo brojeve koji su veći od 10.",
      solution: `brojevi = [4, 12, 7, 18, 25, 3]

for broj in brojevi:
    if broj > 10:
        print(broj)`,
      expectedOutput: `12\n18\n25`,
      hint: "Treba ti for petlja i uslov if broj > 10.",
      check: (code) =>
        code.includes("brojevi") &&
        code.includes("for") &&
        code.includes("if") &&
        code.includes(">10") &&
        code.includes("print("),
    },
    {
      redoslijed: 11,
      title: "Muzička plejlista",
      description:
        "Napravi listu 'plejlista' sa 4 pjesme koje voliš. Dodaj novu pjesmu na kraj koristeći append(). Provjeri da li je \"Bohemian Rhapsody\" već na listi i ispiši rezultat. Zamijeni prvu pjesmu (indeks 0) sa \"Hotel California\". Ispiši finalnu plejlista.",
      solution: `plejlista = ["Stairway to Heaven", "Smells Like Teen Spirit", "Purple Rain", "Imagine"]

plejlista.append("Sweet Child O' Mine")

print("Bohemian Rhapsody" in plejlista)

plejlista[0] = "Hotel California"

print(plejlista)`,
      expectedOutput: `False\n['Hotel California', 'Smells Like Teen Spirit', 'Purple Rain', 'Imagine', "Sweet Child O' Mine"]`,
      hint: "Koristi append() za dodavanje, 'in' za provjeru i indeks [0] za zamjenu.",
      check: (code) =>
        code.includes("plejlista=[") &&
        code.includes("append(") &&
        code.includes("inplejlista") &&
        code.includes("plejlista[0]=") &&
        code.includes("print("),
    },
    {
      redoslijed: 12,
      title: "Upravljanje listom zadataka",
      description:
        "Napravi listu 'zadaci' sa stavkama \"matematika\", \"fizika\" i \"hemija\". Dodaj \"informatika\" na kraj. Provjeri da li je \"muzika\" na listi i ispiši rezultat. Završio si fiziku — ukloni je sa liste. Ispiši finalnu listu i koliko zadataka je ostalo.",
      solution: `zadaci = ["matematika", "fizika", "hemija"]

zadaci.append("informatika")

print("muzika" in zadaci)

zadaci.remove("fizika")

print(zadaci)
print(len(zadaci))`,
      expectedOutput: `False\n['matematika', 'hemija', 'informatika']\n3`,
      hint: "Koristi append(), 'in', remove() i len().",
      check: (code) =>
        code.includes("zadaci") &&
        code.includes("append(") &&
        code.includes("inzadaci") &&
        code.includes("remove(") &&
        code.includes("len(") &&
        code.includes("print("),
    },
  ],
};

export default liste;

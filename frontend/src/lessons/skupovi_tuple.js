const skupoviTuple = {
  badge: "Lekcija 8",
  title: "Skupovi i Tuple u Pythonu",
  heroClass: "sets-hero",
  description:
    "U ovoj lekciji učiš šta su tuple i skupovi, čime se razlikuju od lista i kada ih koristiti.",
  duration: "30 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je tuple i kada ga koristiti", blockIndex: 0 },
    { tekst: "Znaš šta je skup i kako uklanja duplikate", blockIndex: 1 },
    { tekst: "Znaš osnovne operacije nad skupovima", blockIndex: 2 },
  ],

  theoryBlocks: [
    {
      title: "Tuple — nepromjenjiva lista",
      text: "Tuple je kao lista, ali se ne može mijenjati nakon što se napravi. Pišemo ga sa običnim zagradama (). Koristi ga kada znaš da se podaci neće mijenjati — npr. koordinate, datumi, RGB boje.",
      code: `koordinate = (43.85, 18.39)
boja = (255, 0, 0)
dani = ("Pon", "Uto", "Sri", "Cet", "Pet")

print(koordinate[0])
print(dani[2])`,
      codeObjasnjenje: [
        "( ) — obične zagrade označavaju tuple",
        "koordinate[0] — pristupamo elementima isto kao i kod liste, ispisuje 43.85",
        "dani[2] — treći element (indeks 2), ispisuje Sri",
        "Jedina razlika od liste — ne možeš dodati, ukloniti ni promijeniti element",
      ],
      vjezbaSintakse: {
        uputstvo: "RGB boja se predstavlja sa tri broja (crvena, zelena, plava) — svaki od 0 do 255. Napravi tuple 'boja' koji predstavlja jednu RGB boju i ispiši posljednju vrijednost (plavu) koristeći negativan indeks.",
        placeholder: "Ovdje upiši kod...",
        hint: "Negativan indeks: boja[-1] vraća posljednji element. Treba ti: boja = (255, 100, 0) i print(boja[-1]).",
        check: (code) =>
          code.includes("boja") &&
          code.includes("[-1]") &&
          code.includes("print("),
      },
    },
    {
      title: "Skup — samo jedinstveni elementi",
      text: "Skup (set) automatski uklanja duplikate — svaki element može biti samo jednom. Pišemo ga sa vitičastim zagradama {} ili sa set(). Redoslijed elemenata nije zajamčen.",
      code: `brojevi = {1, 2, 3, 2, 1, 4}
print(brojevi)

vocke = set(["jabuka", "kruska", "jabuka", "banana"])
print(vocke)`,
      codeObjasnjenje: [
        "{1, 2, 3, 2, 1, 4} — definišemo skup sa duplikatima",
        "print(brojevi) — ispisuje {1, 2, 3, 4}, duplikati su automatski uklonjeni",
        "set([...]) — pretvaramo listu u skup, uklanjaju se duplikati",
        "Redoslijed nije garantovan — elementi mogu biti u drugačijem redoslijedu",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi listu 'ocjene' sa nekim duplikatima, pretvori je u skup i ispiši.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: ocjene = [5, 4, 5, 3, 4], skup = set(ocjene) i print(skup).",
        check: (code) =>
          code.includes("ocjene=[") &&
          code.includes("set(ocjene)") &&
          code.includes("print("),
      },
    },
    {
      title: "Operacije nad skupovima",
      text: "Skupovi podržavaju matematičke operacije — presjek (zajednički elementi), unija (svi elementi) i razlika (elementi koji su u jednom ali ne i u drugom).",
      code: `a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a & b)
print(a | b)
print(a - b)`,
      codeObjasnjenje: [
        "a & b — presjek: elementi koji su i u a i u b → {3, 4}",
        "a | b — unija: svi elementi iz oba skupa → {1, 2, 3, 4, 5, 6}",
        "a - b — razlika: elementi koji su u a ali ne i u b → {1, 2}",
      ],
      vjezbaSintakse: null,
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Čime se označava tuple?",
      answers: ["{ }", "[ ]", "( )"],
      correct: 2,
    },
    {
      redoslijed: 3,
      question: "Šta je posebno kod skupa (set)?",
      answers: [
        "Čuva duplikate",
        "Automatski uklanja duplikate",
        "Elementi su uvijek sortirani",
      ],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Možeš li promijeniti element tuple nakon što ga napraviš?",
      answers: ["Da", "Ne", "Samo prvi element"],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Šta vraća a & b za skupove?",
      answers: ["Uniju — sve elemente", "Presjek — zajedničke elemente", "Razliku"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: "Kako se lista pretvara u skup?",
      answers: ["list(skup)", "set(lista)", "tuple(lista)"],
      correct: 1,
    },
  ],

  codingTasks: [
    {
      redoslijed: 7,
      title: "Učenici u razredima",
      description:
        "Data su ti dva razreda:\nRazred A: Ana, Marko, Sara, Luka, Nina\nRazred B: Marko, Jovana, Nina, Stefan, Ana\nPronađi učenike koji su u oba razreda i ispiši ih. Pronađi i učenike koji su samo u prvom razredu i ispiši ih.",
      solution: `razred_a = {"Ana", "Marko", "Sara", "Luka", "Nina"}
razred_b = {"Marko", "Jovana", "Nina", "Stefan", "Ana"}

u_oba = razred_a & razred_b
samo_a = razred_a - razred_b

print("U oba razreda:", u_oba)
print("Samo u prvom:", samo_a)`,
      expectedOutput: `U oba razreda: {'Ana', 'Marko', 'Nina'}\nSamo u prvom: {'Sara', 'Luka'}`,
      hint: "Koristi & za presjek i - za razliku skupova.",
      check: (code) =>
        code.includes("razred_a") &&
        code.includes("razred_b") &&
        code.includes("razred_a&razred_b") &&
        code.includes("razred_a-razred_b") &&
        code.includes("print("),
    },
    {
      redoslijed: 8,
      title: "Srednja tačka",
      description:
        "Date su ti dvije tačke u 2D prostoru: tacka_a = (2, 4) i tacka_b = (8, 10). Izračunaj srednju tačku između njih. Srednja tačka se dobija kao ((x1 + x2) / 2, (y1 + y2) / 2). Ispiši rezultat.",
      solution: `tacka_a = (2, 4)
tacka_b = (8, 10)

srednja_x = (tacka_a[0] + tacka_b[0]) / 2
srednja_y = (tacka_a[1] + tacka_b[1]) / 2

srednja = (srednja_x, srednja_y)
print("Srednja tacka:", srednja)`,
      expectedOutput: `Srednja tacka: (5.0, 7.0)`,
      hint: "Pristupaj elementima tuple-a sa [0] za x i [1] za y koordinatu.",
      check: (code) =>
        code.includes("tacka_a") &&
        code.includes("tacka_b") &&
        code.includes("[0]") &&
        code.includes("[1]") &&
        code.includes("/2") &&
        code.includes("print("),
    },
  ],
};

export default skupoviTuple;

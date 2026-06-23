const uslovi = {
  badge: "Lekcija 3",
  title: "Uslovi u Pythonu",
  heroClass: "conditions-hero",
  description:
    "U ovoj lekciji učiš kako Python donosi odluke pomoću if, elif i else naredbi, logičkih operatora i operatora poređenja.",
  duration: "35 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta su operatori poređenja", blockIndex: 0 },
    { tekst: "Znaš kako radi if uslov", blockIndex: 1 },
    { tekst: "Znaš kako rade if i else zajedno", blockIndex: 2 },
    { tekst: "Znaš kako radi elif i kada ga koristiti", blockIndex: 3 },
    { tekst: "Koristiš and, or i not u uslovima", blockIndex: 4 },
  ],

  theoryBlocks: [
    {
      title: "Operatori poređenja",
      text: "Prije nego što naučimo uslove, moramo znati kako Python poredi vrijednosti. Operatori poređenja uvijek vraćaju True ili False — tačno ili netačno.",
      code: `x = 10
y = 5

print(x > y)
print(x < y)
print(x == y)
print(x != y)
print(x >= 10)
print(x <= 9)`,
      codeObjasnjenje: [
        "x > y  — je li 10 veće od 5? Da → True",
        "x < y  — je li 10 manje od 5? Ne → False",
        "x == y — je li 10 jednako 5? Ne → False",
        "x != y — je li 10 različito od 5? Da → True",
        "x >= 10 — je li 10 veće ili jednako 10? Da → True",
        "x <= 9  — je li 10 manje ili jednako 9? Ne → False",
      ],
      vjezbaSintakse: null,
    },
    {
      title: "if uslov",
      text: "if uslov je kao riječ 'ako' u svakodnevnom govoru. Ako je uslov ispunjen — izvršava se kod unutar if bloka. Ako nije — preskače se i program nastavlja dalje.",
      code: `temperatura = 35

if temperatura > 30:
    print("Vruće je!")`,
      codeObjasnjenje: [
        "temperatura = 35 — postavljamo vrijednost temperature",
        "if temperatura > 30 — pitamo: je li temperatura veća od 30?",
        "print('Vruće je!') — ovo se izvršava samo ako je uslov tačan",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi promjenljivu 'bodovi' i dodijeli joj vrijednost 80. Ako je bodovi veće od 50, ispiši 'Polozio si!'.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: bodovi = 80, if bodovi > 50:, print('Polozio si!').",
        check: (code) =>
          code.includes("bodovi") &&
          code.includes(">50") &&
          code.includes("polozio") &&
          code.includes("print("),
      },
    },
    {
      title: "if i else",
      text: "else je 'u suprotnom' — izvršava se kada if uslov nije ispunjen. Zajedno, if i else pokrivaju oba slučaja: kada je uslov tačan i kada nije.",
      code: `ocjena = 4

if ocjena >= 6:
    print("Student je polozio.")
else:
    print("Student nije polozio.")`,
      codeObjasnjenje: [
        "if ocjena >= 6 — pitamo: je li ocjena 6 ili više?",
        "print('Student je polozio.') — izvršava se ako je uslov tačan",
        "else — sve što nije pokrio if ulazi ovdje",
        "print('Student nije polozio.') — izvršava se ako ocjena nije >= 6",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi promjenljivu 'broj' i dodijeli joj vrijednost 7. Ako je broj veći od 0, ispiši 'Pozitivan', u suprotnom ispiši 'Nije pozitivan'.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: broj = 7, if broj > 0:, print('Pozitivan'), else:, print('Nije pozitivan').",
        check: (code) =>
          code.includes("broj") &&
          code.includes(">0") &&
          code.includes("pozitivan") &&
          code.includes("else") &&
          code.includes("print("),
      },
    },
    {
      title: "elif",
      text: "elif dolazi između if i else. Aktivira se ako prethodni uslov nije ispunjen, ali omogućava postavljanje novog uslova. Možeš imati koliko god elif grana hoćeš. Čim jedan uslov bude ispunjen, ostali se preskačaju.",
      code: `prosjek = 3.8

if prosjek >= 4.5:
    uspjeh = "odlican"
elif prosjek >= 3.5:
    uspjeh = "vrlodobar"
elif prosjek >= 2.5:
    uspjeh = "dobar"
elif prosjek >= 2.0:
    uspjeh = "dovoljan"
else:
    uspjeh = "nedovoljan"

print(uspjeh)`,
      vjezbaSintakse: {
        uputstvo: "Napravi promjenljivu 'godine' i dodijeli joj vrijednost 15. Ako je manje ili jednako 12 ispiši 'Dijete', ako je manje ili jednako 17 ispiši 'Tinejdzer', u suprotnom ispiši 'Odrasli'.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: if godine <= 12:, elif godine <= 17:, else: sa odgovarajućim print naredbama.",
        check: (code) =>
          code.includes("godine") &&
          code.includes("elif") &&
          code.includes("dijete") &&
          code.includes("tinejdzer") &&
          code.includes("odrasli") &&
          code.includes("print("),
      },
    },
    {
      title: "and, or i not",
      text: "Logički operatori omogućavaju kombinovanje više uslova. \"and\" znači da oba uslova moraju biti tačna, \"or\" znači da bar jedan mora biti tačan, a \"not\" okreće tačno u netačno i obrnuto.",
      code: `punoljetan = True
ima_vozacku = False

if punoljetan and ima_vozacku:
    print("Mozes voziti.")

if punoljetan or ima_vozacku:
    print("Bar jedan uslov je ispunjen.")

if not ima_vozacku:
    print("Nemas vozacku dozvolu.")`,
      codeObjasnjenje: [
        "punoljetan and ima_vozacku — oba moraju biti True da bi se ispisalo 'Mozes voziti.' Ovdje je False jer nema vozačku → ne ispisuje ništa",
        "punoljetan or ima_vozacku — bar jedan mora biti True → punoljetan je True, pa se ispisuje 'Bar jedan uslov je ispunjen.'",
        "not ima_vozacku — okreće False u True → ima_vozacku je False, not ga čini True, pa se ispisuje 'Nemas vozacku dozvolu.'",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi dvije promjenljive: 'punoljetan = True' i 'ima_licnu = True'. Ako su oba uslova tačna, ispiši 'Mozes glasati'.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: if punoljetan and ima_licnu: pa print('Mozes glasati').",
        check: (code) =>
          code.includes("punoljetan") &&
          code.includes("ima_licnu") &&
          code.includes("and") &&
          code.includes("mozesglasat") &&
          code.includes("print("),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Šta vraća izraz 5 > 3?",
      answers: ["5", "True", "False"],
      correct: 1,
    },
    {
      redoslijed: 3,
      question: "Koji operator provjerava da li su dvije vrijednosti jednake?",
      answers: ["=", "==", "!="],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Šta se dešava ako if uslov nije ispunjen, a nema else bloka?",
      answers: ["Program se ruši", "Izvršava se if blok", "Ne izvršava se ništa"],
      correct: 2,
    },
    {
      redoslijed: 5,
      question: "Ako je prvi elif uslov tačan, šta se dešava sa ostalim elif uslovima?",
      answers: ["Svi se provjeravaju", "Preskačaju se", "Izvršavaju se paralelno"],
      correct: 1,
    },
    {
      redoslijed: 6,
      question: "Koliko elif grana može biti u jednom if bloku?",
      answers: ["Samo jedna", "Samo dvije", "Koliko god hoćeš"],
      correct: 2,
    },
    {
      redoslijed: 7,
      question: "Šta vraća: True and False?",
      answers: ["True", "False", "Grešku"],
      correct: 1,
    },
    {
      redoslijed: 8,
      question: "Šta vraća: not True?",
      answers: ["True", "False", "None"],
      correct: 1,
    },
    {
      redoslijed: 9,
      question: "Šta vraća: True or False?",
      answers: ["False", "Grešku", "True"],
      correct: 2,
    },
    {
      redoslijed: 10,
      question: "Koji operator vraća True ako su vrijednosti različite?",
      answers: ["==", ">=", "!="],
      correct: 2,
    },
  ],

  codingTasks: [
    {
      redoslijed: 11,
      title: "Podizanje novca s bankomata",
      description:
        "Napravi program koji simulira podizanje novca s bankomata. Napravi dvije promjenljive: stanje = 500 i iznos = 200. Ako je iznos veći od stanja, ispiši 'Nedovoljno sredstava.' U suprotnom, oduzmi iznos od stanja i ispiši 'Uspjesno ste podigli 200 E.' i u novom redu 'Novo stanje: 300 E.'",
      solution: `stanje = 500
iznos = 200

if iznos > stanje:
    print("Nedovoljno sredstava.")
else:
    stanje = stanje - iznos
    print("Uspjesno ste podigli", iznos, "E.")
    print("Novo stanje:", stanje, "E.")`,
      expectedOutput: `Uspjesno ste podigli 200 E.\nNovo stanje: 300 E.`,
      hint: "Koristi if da provjeriš ima li dovoljno novca, pa else za uspješno podizanje. Ne zaboravi da ažuriraš stanje prije ispisa.",
      check: (code) =>
        code.includes("stanje") &&
        code.includes("iznos") &&
        code.includes("if") &&
        code.includes("else") &&
        code.includes("print("),
    },
    {
      redoslijed: 12,
      title: "Ulaz u klub",
      description:
        "Napravi provjeru za ulaz u klub. Korisnik ima dvije promjenljive: 'godine' i 'ima_clanska_karta'. Ako je punoljetan i ima karticu — ispiši 'Ulaz slobodan.', ako je punoljetan bez kartice — ispiši 'Mozete kupiti clansku kartu.', ako nije punoljetan — ispiši 'Zabranjen ulaz.'",
      solution: `godine = 20
ima_clanska_karta = True

if godine >= 18 and ima_clanska_karta:
    print("Ulaz slobodan.")
elif godine >= 18:
    print("Mozete kupiti clansku kartu.")
else:
    print("Zabranjen ulaz.")`,
      expectedOutput: `Ulaz slobodan.`,
      hint: "Koristi and u prvom uslovu da provjeriš oba uvjeta odjednom.",
      check: (code) =>
        code.includes("godine") &&
        code.includes("ima_clanska_karta") &&
        code.includes("and") &&
        code.includes("elif") &&
        code.includes("print("),
    },
  ],
};

export default uslovi;

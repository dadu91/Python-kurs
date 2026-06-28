const uvod = {
  badge: "Lekcija 1",
  title: "Uvod u Python",
  heroClass: "intro-hero",
  description:
    "U ovoj lekciji učiš šta je Python, kako se pokreće prvi program i kako se koristi print naredba.",
  duration: "20 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je Python", blockIndex: 0 },
    { tekst: "Znaš čemu služi print()", blockIndex: 1 },
    { tekst: "Znaš čemu služi input()", blockIndex: 2 },
    { tekst: "Umiješ da napišeš prvi program", blockIndex: 1 },
  ],

  theoryBlocks: [
    {
      title: "Šta je Python?",
      text: "Python je programski jezik koji se koristi za web aplikacije, automatizaciju, analizu podataka, vještačku inteligenciju i mnoge druge oblasti.",
      code: `print("Zdravo, Python!")`,
      codeObjasnjenje: [
        'print("Zdravo, Python!") — ispisuje tekst Zdravo, Python! na ekran',
        "Tekst koji želimo ispisati pišemo između navodnika unutar zagrade",
      ],
      vjezbaSintakse: {
        uputstvo: "Ispiši svoje ime koristeći print naredbu.",
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: print("Tvoje ime")',
        check: (code) => code.includes("print("),
      },
    },
    {
      title: "Print naredba",
      text: "Naredba print() služi za ispis teksta ili vrijednosti na ekran. Tekst pišemo između navodnika.",
      code: `print("Učim Python")

ime = "Petar"
print("Zdravo, moje ime je", ime)`,
      codeObjasnjenje: [
        'print("Učim Python") — ispisuje tekst Učim Python',
        'ime = "Petar" — kreiramo promjenljivu ime i dodjeljujemo joj vrijednost Petar',
        'print("Zdravo, moje ime je", ime) — ispisuje tekst i vrijednost promjenljive zajedno',
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi dvije promjenljive — 'ime' sa tvojim imenom i 'godine' sa tvojim godinama. Ispiši ih zajedno u jednoj rečenici.",
        placeholder: "Ovdje upiši kod...",
        hint: 'Treba ti: ime = "...", godine = ... i print("Moje ime je", ime, "i imam", godine, "godina.").',
        check: (code) =>
          code.includes("ime") &&
          code.includes("godine") &&
          code.includes("print("),
      },
    },
    {
      title: "input() — unos od korisnika",
      text: "input() je naredba koja zaustavlja program i čeka da korisnik nešto upiše. Ono što korisnik upiše može da se sačuva u promjenljivu i koristi dalje u programu. Napomena: u ovom kursu ne možeš testirati input() jer nemamo pravi terminal, ali važno je da znaš kako izgleda.",
      code: `ime = input("Upiši svoje ime: ")
print("Zdravo,", ime)`,
      codeObjasnjenje: [
        "input(\"Upiši svoje ime: \") — ispisuje poruku i čeka da korisnik upiše nešto",
        "ime = ... — ono što korisnik upiše čuva se u promjenljivu ime",
        "print(\"Zdravo,\", ime) — ispisuje pozdrav sa imenom koje je korisnik unio",
      ],
      vjezbaSintakse: null,
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Šta će ispisati kod: print('Python')?",
      answers: ["Python", "print", "Grešku"],
      correct: 0,
    },
    {
      redoslijed: 3,
      question: "Tekst u Pythonu najčešće pišemo između:",
      answers: ["zagrada", "navodnika", "zareza"],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Šta radi input() u Pythonu?",
      answers: ["Ispisuje tekst na ekran", "Čita unos od korisnika", "Pokreće program"],
      correct: 1,
    },
  ],

  codingTasks: [
    {
      redoslijed: 5,
      title: "Mini CV",
      description:
        "Napravi promjenljive za ime, godine, grad i hobi. Svaku ispiši u zasebnom print-u kao na CV-u — svaka informacija u svom redu, npr:\nIme: Ana\nGodine: 20\nGrad: Podgorica\nHobi: fotografija",
      solution: `ime = "Ana"
godine = 20
grad = "Podgorica"
hobi = "fotografija"

print("Ime:", ime)
print("Godine:", godine)
print("Grad:", grad)
print("Hobi:", hobi)`,
      expectedOutput: `Ime: Ana\nGodine: 20\nGrad: Podgorica\nHobi: fotografija`,
      hint: "Napravi četiri promjenljive pa ispiši svaku u zasebnom print-u sa oznakom.",
      check: (code) =>
        code.includes("ime") &&
        code.includes("godine") &&
        code.includes("grad") &&
        code.includes("hobi") &&
        (code.match(/print\(/g) || []).length >= 4,
    },
  ],
};

export default uvod;

const rjecnici = {
  badge: "Lekcija 9",
  title: "Rječnici u Pythonu",
  heroClass: "dicts-hero",
  description:
    "U ovoj lekciji učiš šta su rječnici, kako se čuvaju podaci u parovima ključ-vrijednost i kako ih koristiti u praksi.",
  duration: "35 min",
  level: "Početnik",

  goals: [
    { tekst: "Razumiješ šta je rječnik i kako funkcioniše", blockIndex: 0 },
    { tekst: "Znaš kako pristupiti vrijednosti po ključu", blockIndex: 1 },
    { tekst: "Znaš kako dodati i promijeniti vrijednost", blockIndex: 2 },
    { tekst: "Umiješ da prođeš kroz rječnik petljom", blockIndex: 3 },
  ],

  theoryBlocks: [
    {
      title: "Šta je rječnik?",
      text: "Rječnik čuva podatke u parovima — svaka vrijednost ima svoj ključ. Zamisli pravi rječnik: upisuješ riječ (ključ) i dobijaš definiciju (vrijednost). U Pythonu rječnik pišemo sa vitičastim zagradama {}.",
      code: `osoba = {
    "ime": "Ana",
    "godine": 22,
    "grad": "Podgorica"
}

print(osoba)`,
      codeObjasnjenje: [
        "{ } — vitičaste zagrade označavaju rječnik",
        "\"ime\": \"Ana\" — ključ je \"ime\", vrijednost je \"Ana\"",
        "\"godine\": 22 — ključ je \"godine\", vrijednost je broj 22",
        "Svaki par ključ-vrijednost odvojen je zarezom",
      ],
      vjezbaSintakse: null,
    },
    {
      title: "Pristupanje vrijednostima",
      text: "Vrijednosti iz rječnika dobijaš tako što napišeš ime rječnika i u uglatim zagradama upišeš ključ. Ako ključ ne postoji, Python vraća grešku — zato postoji i get() metoda koja vraća None umjesto greške.",
      code: `osoba = {
    "ime": "Ana",
    "godine": 22,
    "grad": "Podgorica"
}

print(osoba["ime"])
print(osoba["godine"])
print(osoba.get("email", "nema emaila"))`,
      codeObjasnjenje: [
        "osoba[\"ime\"] — pristupamo vrijednosti sa ključem \"ime\", ispisuje Ana",
        "osoba[\"godine\"] — pristupamo vrijednosti sa ključem \"godine\", ispisuje 22",
        "osoba.get(\"email\", \"nema emaila\") — ključ ne postoji, vraća zadanu vrijednost",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi rječnik 'auto' sa ključevima 'marka' i 'godina'. Ispiši vrijednost ključa 'marka'.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: auto = {\"marka\": \"...\", \"godina\": ...} i print(auto[\"marka\"]).",
        check: (code) =>
          code.includes("auto={") &&
          code.includes("marka") &&
          code.includes("godina") &&
          code.includes('print(auto["marka"]'),
      },
    },
    {
      title: "Dodavanje i mijenjanje vrijednosti",
      text: "Rječnik je promjenjiv — možeš dodavati nove parove i mijenjati postojeće. Sintaksa je ista: rjecnik[\"kljuc\"] = nova_vrijednost. Ako ključ već postoji, mijenja vrijednost. Ako ne postoji, dodaje novi par.",
      code: `osoba = {"ime": "Ana", "godine": 22}

osoba["grad"] = "Podgorica"
osoba["godine"] = 23

print(osoba)`,
      codeObjasnjenje: [
        "osoba[\"grad\"] = \"Podgorica\" — ključ \"grad\" ne postoji, dodaje se novi par",
        "osoba[\"godine\"] = 23 — ključ \"godine\" postoji, mijenja se vrijednost sa 22 na 23",
        "print(osoba) — ispisuje cijeli rječnik sa svim promjenama",
      ],
      vjezbaSintakse: {
        uputstvo: "Napravi rječnik 'igrac' sa ključem 'ime'. Dodaj novi ključ 'bodovi' sa vrijednošću 100 i ispiši rječnik.",
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: igrac = {\"ime\": \"...\"}, igrac[\"bodovi\"] = 100 i print(igrac).",
        check: (code) =>
          code.includes("igrac={") &&
          code.includes('igrac["bodovi"]=100') &&
          code.includes("print(igrac)"),
      },
    },
    {
      title: "Prolazak kroz rječnik",
      text: "Kroz rječnik možeš proći petljom na tri načina — samo kroz ključeve (rjecnik.keys()), samo kroz vrijednosti (rjecnik.values()), ili kroz oboje odjednom (rjecnik.items()). rjecnik.items() vraća tuple parove (ključ, vrijednost) koje možeš odmah raspakovati u dvije promjenljive.",
      code: `osoba = {"ime": "Ana", "godine": 22, "grad": "Podgorica"}

for kljuc in osoba.keys():
    print(kljuc)

for vrijednost in osoba.values():
    print(vrijednost)

for kljuc, vrijednost in osoba.items():
    print(kljuc, ":", vrijednost)`,
      codeObjasnjenje: [
        "osoba.keys() — prolazimo samo kroz ključeve → ime, godine, grad",
        "osoba.values() — prolazimo samo kroz vrijednosti → Ana, 22, Podgorica",
        "osoba.items() — vraća tuple parove: ('ime', 'Ana'), ('godine', 22)...",
        "for kljuc, vrijednost in ... — raspakovujemo svaki tuple u dvije promjenljive",
      ],
      vjezbaSintakse: {
        uputstvo: "Dat ti je rječnik bodovi. Prođi kroz njega koristeći .items() i svakom igraču povećaj rezultat za 1. Ispiši ažurirani rječnik.",
        initialCode: `bodovi = {"Ana": 10, "Marko": 8}\n`,
        placeholder: "Ovdje upiši kod...",
        hint: "Treba ti: for igrac, rezultat in bodovi.items(): i bodovi[igrac] += 1, pa print(bodovi).",
        check: (code) =>
          code.includes("bodovi") &&
          code.includes("items()") &&
          code.includes("+=1") &&
          code.includes("print("),
      },
    },
  ],

  questions: [
    {
      redoslijed: 2,
      question: "Kako se označava rječnik u Pythonu?",
      answers: ["[ ]", "( )", "{ }"],
      correct: 2,
    },
    {
      redoslijed: 3,
      question: "Kako se pristupa vrijednosti u rječniku?",
      answers: ["rjecnik(kljuc)", "rjecnik[kljuc]", "rjecnik.kljuc()"],
      correct: 1,
    },
    {
      redoslijed: 4,
      question: "Šta se dešava ako dodaš novi ključ koji već postoji?",
      answers: ["Dodaje se novi par", "Vrijednost se mijenja", "Python vraća grešku"],
      correct: 1,
    },
    {
      redoslijed: 5,
      question: "Koja metoda vraća sve parove ključ-vrijednost?",
      answers: [".keys()", ".values()", ".items()"],
      correct: 2,
    },
    {
      redoslijed: 6,
      question: "Šta vraća get() ako ključ ne postoji?",
      answers: ["Grešku", "None ili zadanu vrijednost", "Prazan string"],
      correct: 1,
    },
  ],

  codingTasks: [
    {
      redoslijed: 7,
      title: "Kontakt kartica",
      description:
        "Napravi rječnik 'kontakt' sa ključevima 'ime', 'telefon' i 'email'. Dodaj novi ključ 'grad'. Na kraju ispiši svaki ključ i vrijednost u formatu: ključ : vrijednost.",
      solution: `kontakt = {
    "ime": "Ana",
    "telefon": "067123456",
    "email": "ana@gmail.com"
}

kontakt["grad"] = "Podgorica"

for kljuc, vrijednost in kontakt.items():
    print(kljuc, ":", vrijednost)`,
      expectedOutput: `ime : Ana\ntelefon : 067123456\nemail : ana@gmail.com\ngrad : Podgorica`,
      hint: "Napravi rječnik, dodaj grad sa rjecnik[\"grad\"] = \"...\", pa prođi kroz .items() petljom.",
      check: (code) =>
        code.includes("kontakt") &&
        code.includes("ime") &&
        code.includes("telefon") &&
        code.includes("grad") &&
        code.includes("items()") &&
        code.includes("print("),
    },
    {
      redoslijed: 8,
      title: "Brojanje pojavljivanja",
      description:
        "Data ti je lista voća: vocke = [\"jabuka\", \"kruska\", \"jabuka\", \"banana\", \"kruska\", \"jabuka\"]. Napravi rječnik koji broji koliko puta se svako voće pojavljuje. Ispiši rječnik.",
      solution: `vocke = ["jabuka", "kruska", "jabuka", "banana", "kruska", "jabuka"]
brojac = {}

for vocka in vocke:
    if vocka in brojac:
        brojac[vocka] += 1
    else:
        brojac[vocka] = 1

print(brojac)`,
      expectedOutput: `{'jabuka': 3, 'kruska': 2, 'banana': 1}`,
      hint: "Prođi kroz listu petljom. Za svako voće provjeri postoji li već u rječniku — ako da, povećaj broj, ako ne, postavi na 1.",
      check: (code) =>
        code.includes("vocke") &&
        code.includes("brojac") &&
        code.includes("for") &&
        code.includes("inbrojac") &&
        code.includes("+=1") &&
        code.includes("=1") &&
        code.includes("print(brojac)"),
    },
  ],
};

export default rjecnici;

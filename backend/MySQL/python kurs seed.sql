USE python_kurs;

-- Lekcije
INSERT INTO lekcija (naziv, redosljed, opis) VALUES
('Uvod u Python', 1, 'Šta je Python, kako se pokreće prvi program i kako se koristi print naredba.'),
('Petlje u Pythonu', 2, 'For i while petlje, range(), prolazak kroz listu i najčešće greške u petljama.'),
('Zadaci u Pythonu', 3, 'Osnovni Python zadaci koristeći promjenljive, uslove i petlje.');

-- Zadaci za Lekciju 1 - Uvod u Python (id=1)
INSERT INTO zadatak (lekcija_id, tezina, tip) VALUES
(1, 'laka', 'teorija'),
(1, 'laka', 'quiz'),
(1, 'laka', 'quiz'),
(1, 'laka', 'quiz');

-- Zadaci za Lekciju 2 - Petlje u Pythonu (id=2)
INSERT INTO zadatak (lekcija_id, tezina, tip) VALUES
(2, 'laka', 'teorija'),
(2, 'laka', 'quiz'),
(2, 'laka', 'quiz'),
(2, 'laka', 'quiz'),
(2, 'srednja', 'quiz'),
(2, 'srednja', 'quiz'),
(2, 'srednja', 'quiz'),
(2, 'srednja', 'quiz'),
(2, 'laka', 'prakticni'),
(2, 'laka', 'prakticni'),
(2, 'srednja', 'prakticni'),
(2, 'srednja', 'prakticni'),
(2, 'teska', 'prakticni');

-- Zadaci za Lekciju 3 - Zadaci u Pythonu (id=3)
INSERT INTO zadatak (lekcija_id, tezina, tip) VALUES
(3, 'laka', 'teorija'),
(3, 'laka', 'quiz'),
(3, 'laka', 'quiz'),
(3, 'srednja', 'quiz');

-- Greske (najcesce Python greske)
INSERT INTO greska (tip_greske, opis) VALUES
('SyntaxError', 'Greška u sintaksi — fali dvotačka, zagrada ili navodnik.'),
('IndentationError', 'Pogrešno uvlačenje koda — Python zahtijeva konzistentne razmake.'),
('NameError', 'Koristi se promjenljiva ili funkcija koja nije definisana.'),
('TypeError', 'Pogrešan tip podataka — npr. sabiranje stringa i broja.'),
('ValueError', 'Pogrešna vrijednost — npr. int("abc").'),
('IndexError', 'Pristup elementu liste koji ne postoji.'),
('ZeroDivisionError', 'Dijeljenje s nulom.'),
('LogicError', 'Kod se izvršava bez greške ali daje pogrešan rezultat.');

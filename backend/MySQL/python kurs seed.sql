USE python_kurs;

-- Lekcije
INSERT INTO lekcija (naziv, redoslijed, opis) VALUES
('Uvod u Python', 1, 'Šta je Python, kako se pokreće prvi program i kako se koristi print naredba.'),
('Petlje u Pythonu', 2, 'For i while petlje, range(), prolazak kroz listu i najčešće greške u petljama.'),
('Zadaci u Pythonu', 3, 'Osnovni Python zadaci koristeći promjenljive, uslove i petlje.');

-- Zadaci za Lekciju 1 - Uvod u Python (id=1)
INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
(1, 1, 'laka', 'teorija'),
(1, 2, 'laka', 'quiz'),
(1, 3, 'laka', 'quiz'),
(1, 4, 'laka', 'quiz');

-- Zadaci za Lekciju 2 - Petlje u Pythonu (id=2)
-- redoslijed 1: teorija
-- redoslijed 2-8: quiz (7 pitanja)
-- redoslijed 9-11: prakticni (3 zadatka)
INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
(2, 1, 'laka', 'teorija'),
(2, 2, 'laka', 'quiz'),
(2, 3, 'laka', 'quiz'),
(2, 4, 'laka', 'quiz'),
(2, 5, 'srednja', 'quiz'),
(2, 6, 'srednja', 'quiz'),
(2, 7, 'srednja', 'quiz'),
(2, 8, 'srednja', 'quiz'),
(2, 9, 'laka', 'prakticni'),
(2, 10, 'srednja', 'prakticni'),
(2, 11, 'teska', 'prakticni');

-- Zadaci za Lekciju 3 - Zadaci u Pythonu (id=3)
INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
(3, 1, 'laka', 'teorija'),
(3, 2, 'laka', 'quiz'),
(3, 3, 'laka', 'quiz'),
(3, 4, 'srednja', 'quiz');

-- Greske
INSERT INTO greska (tip_greske, opis) VALUES
('SyntaxError', 'Greška u sintaksi — fali dvotačka, zagrada ili navodnik.'),
('IndentationError', 'Pogrešno uvlačenje koda — Python zahtijeva konzistentne razmake.'),
('NameError', 'Koristi se promjenljiva ili funkcija koja nije definisana.'),
('TypeError', 'Pogrešan tip podataka — npr. sabiranje stringa i broja.'),
('ValueError', 'Pogrešna vrijednost — npr. int("abc").'),
('IndexError', 'Pristup elementu liste koji ne postoji.'),
('ZeroDivisionError', 'Dijeljenje s nulom.'),
('LogicError', 'Kod se izvršava bez greške ali daje pogrešan rezultat.');

-- Lekcija 4 - Promjenljive
INSERT INTO lekcija (naziv, redosljed, opis) VALUES
('Promjenljive u Pythonu', 4, 'Šta su promjenljive, tipovi podataka i kako Python sam prepoznaje tip.');

-- Zadaci za Lekciju 4
INSERT INTO zadatak (lekcija_id, tezina, tip) VALUES
(4, 'laka', 'teorija'),
(4, 'laka', 'quiz'),
(4, 'laka', 'quiz'),
(4, 'laka', 'quiz'),
(4, 'laka', 'quiz'),
(4, 'laka', 'quiz');

-- Admin (sifra: Admin.12345)
INSERT INTO korisnik (username, password, mail, uloga) VALUES
('Admin', '$2b$12$frdM2qj/WLqMO3IPmMWmsebHPDT/EaKj5pKl5pShfOI2h/JRtVzMy', 'admin@gmail.com', 'admin');


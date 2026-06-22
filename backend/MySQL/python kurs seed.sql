USE python_kurs;

-- LEKCIJE
INSERT INTO lekcija (naziv, redoslijed, opis) VALUES
('Uvod u Python',         1, 'Šta je Python, kako se pokreće prvi program i kako se koristi print naredba.'),
('Promjenljive u Pythonu',2, 'Šta su promjenljive, tipovi podataka i kako Python sam prepoznaje tip.'),
('Liste u Pythonu',       3, 'Šta su liste, kako se prave, kako pristupamo elementima i kako prolazimo kroz listu.'),
('Petlje u Pythonu',      4, 'For i while petlje, range(), prolazak kroz listu i najčešće greške u petljama.');


-- ZADACI - Lekcija 1: Uvod

INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
((SELECT id FROM lekcija WHERE naziv = 'Uvod u Python'), 1, 'laka',   'teorija'),
((SELECT id FROM lekcija WHERE naziv = 'Uvod u Python'), 2, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Uvod u Python'), 3, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Uvod u Python'), 4, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Uvod u Python'), 5, 'laka',   'prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Uvod u Python'), 6, 'srednja','prakticni');


-- ZADACI - Lekcija 2: Promjenljive

INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
((SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu'), 1, 'laka', 'teorija'),
((SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu'), 2, 'laka', 'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu'), 3, 'laka', 'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu'), 4, 'laka', 'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu'), 5, 'laka', 'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu'), 6, 'laka', 'quiz');


-- ZADACI - Lekcija 3: Liste

INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  1, 'laka',   'teorija'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  2, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  3, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  4, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  5, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  6, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  7, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  8, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'),  9, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'), 10, 'srednja','prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'), 11, 'srednja','prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'), 12, 'srednja','prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'), 13, 'srednja','prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Liste u Pythonu'), 14, 'srednja','prakticni');



-- ZADACI - Lekcija 4: Petlje

INSERT INTO zadatak (lekcija_id, redoslijed, tezina, tip) VALUES
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  1, 'laka',   'teorija'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  2, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  3, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  4, 'laka',   'quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  5, 'srednja','quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  6, 'srednja','quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  7, 'srednja','quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  8, 'srednja','quiz'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'),  9, 'laka',   'prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'), 10, 'srednja','prakticni'),
((SELECT id FROM lekcija WHERE naziv = 'Petlje u Pythonu'), 11, 'teska',  'prakticni');



-- GRESKE

INSERT INTO greska (tip_greske, opis) VALUES
('SyntaxError',       'Greška u sintaksi — fali dvotačka, zagrada ili navodnik.'),
('IndentationError',  'Pogrešno uvlačenje koda — Python zahtijeva konzistentne razmake.'),
('NameError',         'Koristi se promjenljiva ili funkcija koja nije definisana.'),
('TypeError',         'Pogrešan tip podataka — npr. sabiranje stringa i broja.'),
('ValueError',        'Pogrešna vrijednost — npr. int("abc").'),
('IndexError',        'Pristup elementu liste koji ne postoji.'),
('ZeroDivisionError', 'Dijeljenje s nulom.'),
('LogicError',        'Kod se izvršava bez greške ali daje pogrešan rezultat.');



-- ADMIN (sifra: Admin.12345)

INSERT INTO korisnik (username, password, mail, uloga) VALUES
('Admin', '$2b$12$frdM2qj/WLqMO3IPmMWmsebHPDT/EaKj5pKl5pShfOI2h/JRtVzMy', 'admin@gmail.com', 'admin');

-- dodavanje kolona u tabeli zadatak
ALTER TABLE zadatak
ADD COLUMN naziv VARCHAR(255) NULL;

ALTER TABLE zadatak
ADD COLUMN opis TEXT NULL;

ALTER TABLE zadatak
ADD COLUMN odgovor_a VARCHAR(255) NULL,
ADD COLUMN odgovor_b VARCHAR(255) NULL,
ADD COLUMN odgovor_c VARCHAR(255) NULL,
ADD COLUMN odgovor_d VARCHAR(255) NULL,
ADD COLUMN tacan_odgovor INT NULL;

ALTER TABLE zadatak
ADD COLUMN rjesenje TEXT NULL,
ADD COLUMN ocekivani_izlaz TEXT NULL;

-- dodavanje kolona u tabeli LEKCIJE
ALTER TABLE lekcija ADD COLUMN ciljevi TEXT;
ALTER TABLE lekcija ADD COLUMN primjer_koda TEXT;
ALTER TABLE lekcija ADD COLUMN objasnjenje_koda TEXT;
ALTER TABLE lekcija
ADD COLUMN trajanje VARCHAR(50) NULL,
ADD COLUMN nivo VARCHAR(50) NULL;
DROP DATABASE python_kurs;


CREATE DATABASE python_kurs;
USE python_kurs;

CREATE TABLE korisnik (
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
    mail VARCHAR(100) NOT NULL UNIQUE,
    uloga VARCHAR(20) DEFAULT 'korisnik',
    datum_reg DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lekcija (
	id INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL UNIQUE,
    redoslijed INT NOT NULL,
    opis TEXT
);

CREATE TABLE zadatak (
	id INT AUTO_INCREMENT PRIMARY KEY,
    lekcija_id INT NOT NULL,
    redoslijed INT NOT NULL DEFAULT 1,
    tezina ENUM('laka', 'srednja', 'teska') DEFAULT 'laka',
    tip ENUM('teorija', 'prakticni', 'quiz') DEFAULT 'teorija',
    FOREIGN KEY (lekcija_id) REFERENCES lekcija(id) ON DELETE CASCADE
);

CREATE TABLE zavrsena_lekcija (
	id INT AUTO_INCREMENT PRIMARY KEY,
    lekcija_id INT NOT NULL,
    korisnik_id INT NOT NULL,
    datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lekcija_id) REFERENCES lekcija(id) ON DELETE CASCADE,
    FOREIGN KEY (korisnik_id) REFERENCES korisnik(id) ON DELETE CASCADE
);

CREATE TABLE progres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    korisnik_id INT NOT NULL,
    nivo INT DEFAULT 1,
    bodovi INT DEFAULT 0,
    datum_azuriranja DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (korisnik_id) REFERENCES korisnik(id) ON DELETE CASCADE
);


CREATE TABLE greska (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tip_greske VARCHAR(50) NOT NULL,
    opis TEXT
);

CREATE TABLE zadatak_korisnik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zadatak_id INT NOT NULL,
    korisnik_id INT NOT NULL,
    greska_id INT,
    datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    tacno BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (zadatak_id) REFERENCES zadatak(id) ON DELETE CASCADE,
    FOREIGN KEY (korisnik_id) REFERENCES korisnik(id) ON DELETE CASCADE,
    FOREIGN KEY (greska_id) REFERENCES greska(id) ON DELETE SET NULL
);

select * from korisnik;
select korisnik_id, zadatak_id
from zadatak_korisnik, zadatak, korisnik
where korisnik.id = zadatak_korisnik.korisnik_id and zadatak.id = zadatak_korisnik.zadatak_id and korisnik.id = 8;

select * from zadatak;
select * from zadatak;

select * from zadatak_korisnik;

SELECT * FROM zadatak_korisnik WHERE korisnik_id = 1;
select * from korisnik where id = 1;

DELETE FROM zadatak WHERE lekcija_id = (SELECT id FROM lekcija WHERE redoslijed = 3);
DELETE FROM lekcija WHERE redoslijed = 3;

SELECT id, redoslijed, tip FROM zadatak WHERE lekcija_id = (SELECT id FROM lekcija WHERE naziv = 'Promjenljive u Pythonu');


-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-12-17 11:29:37.915

-- tables
-- Table: Badanie
CREATE TABLE Badanie (
    Badanie_ID int NOT NULL,
    NazwaBadania varchar(100) NOT NULL,
    Koszt decimal(7,3) NOT NULL,
    OpisBadania varchar(200) NOT NULL,
    CONSTRAINT Badanie_pk PRIMARY KEY (Badanie_ID)
);

-- Table: Pacjent
CREATE TABLE Pacjent (
    Pacjent_ID int NOT NULL,
    PESEL decimal(11,0) NOT NULL,
    Uzytkownik_ID int NOT NULL,
    CONSTRAINT Pacjent_pk PRIMARY KEY (Pacjent_ID)
);

-- Table: Pacjent_Badanie
CREATE TABLE Pacjent_Badanie (
    Pacjent_Badanie_ID int NOT NULL,
    Pacjent_ID int NOT NULL,
    Badanie_ID int NOT NULL,
    DataBadania date NOT NULL,
    CONSTRAINT Pacjent_Badanie_pk PRIMARY KEY (Pacjent_Badanie_ID)
);

-- Table: [User]
CREATE TABLE [User] (
    User_ID int NOT NULL,
    Login varchar(50) NOT NULL,
    HasloHash varchar(255) NOT NULL,
    Uzytkownik_ID int NOT NULL,
    PoziomDostepu int NOT NULL,
    CONSTRAINT User_pk PRIMARY KEY (User_ID)
);

-- Table: Uzytkownik
CREATE TABLE Uzytkownik (
    Uzytkownik_ID int NOT NULL,
    Imie varchar(50) NOT NULL,
    Nazwisko varchar(50) NOT NULL,
    Email varchar(100) NOT NULL,
    Wiek decimal(3,0) NOT NULL,
    DataDolaczenia date NOT NULL,
    CONSTRAINT Uzytkownik_pk PRIMARY KEY (Uzytkownik_ID)
);

-- foreign keys
-- Reference: Pacjent_Badanie_Badanie (table: Pacjent_Badanie)
ALTER TABLE Pacjent_Badanie ADD CONSTRAINT Pacjent_Badanie_Badanie FOREIGN KEY (Badanie_ID)
    REFERENCES Badanie (Badanie_ID);

-- Reference: Pacjent_Badanie_Pacjent (table: Pacjent_Badanie)
ALTER TABLE Pacjent_Badanie ADD CONSTRAINT Pacjent_Badanie_Pacjent FOREIGN KEY (Pacjent_ID)
    REFERENCES Pacjent (Pacjent_ID);

-- Reference: Pacjent_Uzytkownik (table: Pacjent)
ALTER TABLE Pacjent ADD CONSTRAINT Pacjent_Uzytkownik FOREIGN KEY (Uzytkownik_ID)
    REFERENCES Uzytkownik (Uzytkownik_ID);

-- Reference: User_Uzytkownik (table: [User])
ALTER TABLE [User] ADD CONSTRAINT User_Uzytkownik FOREIGN KEY (Uzytkownik_ID)
    REFERENCES Uzytkownik (Uzytkownik_ID);

-- End of file.

-- Table: Badanie
INSERT INTO Badanie (Badanie_ID, NazwaBadania, Koszt, OpisBadania) VALUES
(1, 'Badanie krwi', 50.00, 'Podstawowe badanie krwi'),
(2, 'Badanie moczu', 30.00, 'Podstawowe badanie moczu'),
(3, 'RTG klatki piersiowej', 100.00, 'Prześwietlenie klatki piersiowej'),
(4, 'USG jamy brzusznej', 150.00, 'Ultrasonografia jamy brzusznej'),
(5, 'EKG', 70.00, 'Elektrokardiogram'),
(6, 'Badanie kału', 50.00, 'Podstawowe badanie krwi');

select * from Badanie;
select * from Pacjent_Badanie;
select * from [User];
select * from Uzytkownik;
select * from pacjent;

-- drop tables
DROP TABLE Pacjent_Badanie;
DROP TABLE Badanie;
DROP TABLE Pacjent;
DROP TABLE [User];
DROP TABLE Uzytkownik;
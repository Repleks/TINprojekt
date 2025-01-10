const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
    user: 'SA',
    password: 'yourStrong(!)Password',
    server: 'localhost',
    database: 'master',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
};

sql.connect(dbConfig, err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.post('/api/post/login', (req, res) => {
    const { username, password } = req.body;
    const request = new sql.Request();
    request.query(`SELECT * FROM [User] WHERE Login = '${username}'`, async (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const isPasswordValid = await bcrypt.compare(password, user.HasloHash);
            if (isPasswordValid) {
                res.json({
                    Uzytkownik_ID: user.Uzytkownik_ID,
                    PoziomDostepu: user.PoziomDostepu
                });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

app.get('/api/get/patients', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM Pacjent JOIN Uzytkownik U ON Pacjent.Uzytkownik_ID = U.Uzytkownik_ID;', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result.recordset);
    });
});

app.get('/api/get/tests', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM Badanie;', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result.recordset);
    });
});

app.get('/api/get/patient/:id/tests', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();
    request.query(`SELECT * FROM Pacjent_Badanie PB JOIN Badanie B ON PB.Badanie_ID = B.Badanie_ID WHERE Pacjent_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(result.recordset);
        res.json(result.recordset);
    });
});

app.get('/api/get/patient/:id/info', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();
    request.query(`SELECT * FROM Pacjent P JOIN Uzytkownik U ON P.Uzytkownik_ID = U.Uzytkownik_ID WHERE P.Pacjent_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        console.log(result.recordset);
        res.json(result.recordset[0]);
    });
});

app.post('/api/post/patient/:id/test', (req, res) => {
    const { id } = req.params;
    const { testId, date } = req.body;
    const request = new sql.Request();

    request.query('SELECT MAX(Pacjent_Badanie_ID) AS maxTestId FROM Pacjent_Badanie', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        const newTestId = result.recordset[0].maxTestId + 1;

        request.query(`INSERT INTO Pacjent_Badanie (Pacjent_Badanie_ID, Pacjent_ID, Badanie_ID, DataBadania) VALUES (${newTestId}, ${id}, ${testId}, '${date}')`, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(201).send('Test added successfully');
        });
    });
});

app.post('/api/post/test', (req, res) => {
    const { testName, cost, description } = req.body;
    const request = new sql.Request();

    request.query('SELECT MAX(Badanie_ID) AS maxTestId FROM Badanie', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        const newTestId = result.recordset[0].maxTestId + 1;

        request.query(`INSERT INTO Badanie (Badanie_ID, NazwaBadania, Koszt, OpisBadania) VALUES (${newTestId}, '${testName}', ${cost}, '${description}')`, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(201).send('Test added successfully');
        });
    });
});

app.post('/api/post/test/:id/delete', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();

    request.query(`UPDATE Badanie SET Koszt = 0 WHERE Badanie_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send('Test cost updated to 0');
    });
});

app.put('/api/put/test/:id', (req, res) => {
    const { id } = req.params;
    const { testName, cost, description } = req.body;
    const request = new sql.Request();

    request.query(`UPDATE Badanie SET NazwaBadania = '${testName}', Koszt = ${cost}, OpisBadania = '${description}' WHERE Badanie_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send('Test updated successfully');
    });
});

app.put('/api/put/patient/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, age, pesel } = req.body;
    const request = new sql.Request();

    request.query(`UPDATE Pacjent SET PESEL = '${pesel}' WHERE Pacjent_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        request.query(`UPDATE Uzytkownik SET Imie = '${firstName}', Nazwisko = '${lastName}', Email = '${email}', Wiek = ${age} WHERE Uzytkownik_ID = (SELECT Uzytkownik_ID FROM Pacjent WHERE Pacjent_ID = ${id})`, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).send('Patient updated successfully');
        });
    });
});

app.put('/api/put/patient/:id/delete', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();

    request.query(`UPDATE Pacjent SET PESEL = 0 WHERE Uzytkownik_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        request.query(`UPDATE Uzytkownik SET Imie = 'NaN', Nazwisko = 'NaN', Email = 'NaN', Wiek = 0 WHERE Uzytkownik_ID = ${id}`, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).send('Patient data updated successfully');
        });
    });
});

app.post('/api/post/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new sql.Request();

    request.query('SELECT MAX(Uzytkownik_ID) AS maxUserId FROM Uzytkownik', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        const newUserId = result.recordset[0].maxUserId + 1;

        request.query(`INSERT INTO Uzytkownik (Uzytkownik_ID, Imie, Nazwisko, Email, Wiek, DataDolaczenia) VALUES (${newUserId}, 'To be filled', 'To be filled', 'To be filled', 0, GETDATE())`, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            request.query('SELECT MAX(User_ID) AS maxUserLoginId FROM [User]', (err, result) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                const newUserLoginId = result.recordset[0].maxUserLoginId + 1;

                request.query(`INSERT INTO [User] (User_ID, Login, HasloHash, PoziomDostepu, Uzytkownik_ID) VALUES (${newUserLoginId}, '${username}', '${hashedPassword}', 1, ${newUserId})`, (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }

                    request.query('SELECT MAX(Pacjent_ID) AS maxPatientId FROM Pacjent', (err, result) => {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        const newPatientId = result.recordset[0].maxPatientId + 1;

                        request.query(`INSERT INTO Pacjent (Pacjent_ID, PESEL, Uzytkownik_ID) VALUES (${newPatientId}, 0, ${newUserId})`, (err, result) => {
                            if (err) {
                                res.status(500).send(err);
                                return;
                            }
                            res.status(201).send('User registered successfully');
                        });
                    });
                });
            });
        });
    });
});

app.put('/api/put/user/:id/access', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();

    request.query(`UPDATE [User] SET PoziomDostepu = 2 WHERE User_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send('User access level updated successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
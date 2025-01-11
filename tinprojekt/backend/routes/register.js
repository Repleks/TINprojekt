const express = require('express');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/register', [
    body('username').isString().notEmpty(),
    body('password').isString().isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

module.exports = router;
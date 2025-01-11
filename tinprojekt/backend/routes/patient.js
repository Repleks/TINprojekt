const express = require('express');
const sql = require('mssql');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/patients', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM Pacjent JOIN Uzytkownik U ON Pacjent.Uzytkownik_ID = U.Uzytkownik_ID;', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result.recordset);
    });
});

router.get('/patient/:id/tests', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();
    request.query(`SELECT * FROM Pacjent_Badanie PB JOIN Badanie B ON PB.Badanie_ID = B.Badanie_ID WHERE Pacjent_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result.recordset);
    });
});

router.get('/patient/:id/info', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();
    request.query(`SELECT * FROM Pacjent P JOIN Uzytkownik U ON P.Uzytkownik_ID = U.Uzytkownik_ID WHERE P.Pacjent_ID = ${id}`, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result.recordset[0]);
    });
});

router.post('/patient/:id/test', [
    body('testId').isInt().notEmpty(),
    body('date').isISO8601().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

router.put('/patient/:id', [
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('age').isInt().notEmpty(),
    body('pesel').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

module.exports = router;
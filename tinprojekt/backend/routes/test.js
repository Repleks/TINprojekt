const express = require('express');
const sql = require('mssql');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/tests', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM Badanie;', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result.recordset);
    });
});

router.post('/test', [
    body('testName').isString().notEmpty(),
    body('cost').isFloat().notEmpty(),
    body('description').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

router.post('/test/:id/delete', (req, res) => {
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

router.put('/test/:id', [
    body('testName').isString().notEmpty(),
    body('cost').isFloat().notEmpty(),
    body('description').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

module.exports = router;
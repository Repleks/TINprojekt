const express = require('express');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/login', [
    body('username').isString().notEmpty(),
    body('password').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

module.exports = router;
const express = require('express');
const sql = require('mssql');

const router = express.Router();

router.put('/user/:id/access', (req, res) => {
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

module.exports = router;
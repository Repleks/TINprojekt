const express = require('express');
const sql = require('mssql');
const cors = require('cors');

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

app.use('/api/post', require('./routes/login'));
app.use('/api/get', require('./routes/patient'));
app.use('/api/post', require('./routes/patient'));
app.use('/api/put', require('./routes/patient'));
app.use('/api/post', require('./routes/register'));
app.use('/api/post', require('./routes/test'));
app.use('/api/get', require('./routes/test'));
app.use('/api/put', require('./routes/test'));
app.use('/api/put', require('./routes/user'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
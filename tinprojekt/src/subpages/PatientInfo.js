import React from 'react';
import data from '../database.json';
import {Link} from "react-router-dom";

function PatientInfo() {
    const userId = 1; // Assuming the logged-in user has ID 1
    const user = data.Uzytkownik.find(u => u.Uzytkownik_ID === userId);
    const patient = data.Pacjent.find(p => p.Uzytkownik_ID === userId);

    return (
        <div>
            <h2>Patient Info</h2>
            <h3>User Details</h3>
            <p>Name: {user.Imie} {user.Nazwisko}</p>
            <p>Email: {user.Email}</p>
            <p>Age: {user.Wiek}</p>
            <p>Joined: {user.DataDolaczenia}</p>
            <h3>Patient Details</h3>
            <p>PESEL: {patient.PESEL}</p>
            <Link to={`/modifypatientinfo/${userId}`}><button>Modify Info</button></Link>
        </div>
    );
}

export default PatientInfo;
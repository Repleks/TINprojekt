import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function PatientInfo({ language }) {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/get/patient/${id}/info`)
            .then(response => {
                setPatient(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the patient info!', error);
            });
    }, [id]);

    if (!patient) {
        return <div>{language === 'en' ? 'Loading...' : 'Ładowanie...'}</div>;
    }

    return (
        <div className="patient-info">
            <h2>{language === 'en' ? 'Patient Info' : 'Informacje o pacjencie'}</h2>
            <h3>{language === 'en' ? 'User Details' : 'Szczegóły użytkownika'}</h3>
            <p>{language === 'en' ? 'Name' : 'Imię'}: {patient.Imie} {patient.Nazwisko}</p>
            <p>Email: {patient.Email}</p>
            <p>{language === 'en' ? 'Age' : 'Wiek'}: {patient.Wiek}</p>
            <p>{language === 'en' ? 'Joined' : 'Dołączył'}: {patient.DataDolaczenia}</p>
            <h3>{language === 'en' ? 'Patient Details' : 'Szczegóły pacjenta'}</h3>
            <p>PESEL: {patient.PESEL}</p>
            <Link to={`/modifypatientinfo/${id}`}><button>{language === 'en' ? 'Modify Info' : 'Modyfikuj informacje'}</button></Link>
        </div>
    );
}

export default PatientInfo;
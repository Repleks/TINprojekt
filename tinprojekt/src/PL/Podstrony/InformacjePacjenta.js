import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function PatientInfo() {
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
        return <div>Loading...</div>;
    }

    return (
        <div className="patient-info">
            <h2>Patient Info</h2>
            <h3>User Details</h3>
            <p>Name: {patient.Imie} {patient.Nazwisko}</p>
            <p>Email: {patient.Email}</p>
            <p>Age: {patient.Wiek}</p>
            <p>Joined: {patient.DataDolaczenia}</p>
            <h3>Patient Details</h3>
            <p>PESEL: {patient.PESEL}</p>
            <Link to={`/modifypatientinfo/${id}`}><button>Modify Info</button></Link>
        </div>
    );
}

export default PatientInfo;
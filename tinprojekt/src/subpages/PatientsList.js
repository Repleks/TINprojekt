import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PatientsList() {
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        axios.get('http://localhost:3001/api/get/patients')
            .then(response => {
                const transformedPatients = response.data.map(patient => ({
                    Pacjent_ID: patient.Pacjent_ID,
                    PESEL: patient.PESEL,
                    Imie: patient.Imie,
                    Nazwisko: patient.Nazwisko,
                    Email: patient.Email,
                    Wiek: patient.Wiek,
                }));
                setPatients(transformedPatients);
            })
            .catch(error => {
                console.error('There was an error fetching the patients!', error);
            });
    }, []);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const handleDelete = (patientId) => {
        axios.put(`http://localhost:3001/api/put/patient/${patientId}/delete`)
            .then(response => {
                console.log('Patient data updated:', response.data);
                setPatients(patients.map(patient =>
                    patient.Pacjent_ID === patientId
                        ? { ...patient, PESEL: 'NaN', Imie: 'NaN', Nazwisko: 'NaN', Email: 'NaN', Wiek: 0 }
                        : patient
                ));
            })
            .catch(error => {
                console.error('There was an error updating the patient data!', error);
            });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = patients.slice(indexOfFirstItem, indexOfLastItem);

    const renderItems = currentItems.map((item, index) => {
        return (
            <li key={index}>
                <p>Pacjent_ID: {item.Pacjent_ID}</p>
                <p>PESEL: {item.PESEL}</p>
                <p>Imie: {item.Imie}</p>
                <p>Nazwisko: {item.Nazwisko}</p>
                <p>Email: {item.Email}</p>
                <p>Wiek: {item.Wiek}</p>
                <Link to={`/addpatienttest/${item.Pacjent_ID}`}><button>Add Test</button></Link>
                <Link to={`/patientinfo/${item.Pacjent_ID}`}><button>View Info</button></Link>
                <Link to={`/patienttests/${item.Pacjent_ID}`}><button>View Tests</button></Link>
                <button onClick={() => handleDelete(item.Pacjent_ID)}>Delete User</button>
            </li>
        );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(patients.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li
                key={number}
                id={number}
                onClick={handleClick}
                className={currentPage === number ? 'active' : null}
            >
                {number}
            </li>
        );
    });

    return (
        <div>
            <h2>Patients List</h2>
            <ul className="custom-list">
                {renderItems}
            </ul>
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
        </div>
    );
}

export default PatientsList;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../database.json';

function PatientsList() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const handleDelete = (userId) => {
        console.log(`User with ID ${userId} has been deleted.`);
        // jakaś logika tu kiedyś będzie
    };

    const { Pacjent } = data;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Pacjent.slice(indexOfFirstItem, indexOfLastItem);

    const renderItems = currentItems.map((item, index) => {
        const user = data.Uzytkownik.find(u => u.Uzytkownik_ID === item.Uzytkownik_ID);
        return (
            <li key={index}>
                <p>Name: {user.Imie} {user.Nazwisko}</p>
                <p>Email: {user.Email}</p>
                <p>Age: {user.Wiek}</p>
                <p>PESEL: {item.PESEL}</p>
                <Link to={`/addpatienttest/${item.Pacjent_ID}`}><button>Add Test</button></Link>
                <Link to={`/patientinfo/${item.Pacjent_ID}`}><button>View Info</button></Link>
                <Link to={`/patienttests/${item.Pacjent_ID}`}><button>View Tests</button></Link>
                <button onClick={() => handleDelete(item.Uzytkownik_ID)}>Delete User</button>
            </li>
        );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(Pacjent.length / itemsPerPage); i++) {
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
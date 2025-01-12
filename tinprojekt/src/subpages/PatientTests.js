import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PatientTests({ language }) {
    const { id } = useParams();
    const [tests, setTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        axios.get(`http://localhost:3001/api/get/patient/${id}/tests`)
            .then(response => {
                setTests(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tests!', error);
            });
    }, [id]);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tests.slice(indexOfFirstItem, indexOfLastItem);

    const renderItems = currentItems.map((test, index) => (
        <li key={index}>
            <p>{language === 'en' ? 'Test Name' : 'Nazwa badania'}: {test.NazwaBadania}</p>
            <p>{language === 'en' ? 'Cost' : 'Koszt'}: {test.Koszt}</p>
            <p>{language === 'en' ? 'Description' : 'Opis badania'}: {test.OpisBadania}</p>
            <p>{language === 'en' ? 'Date' : 'Data'}: {test.DataBadania}</p>
        </li>
    ));

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tests.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
        <li
            key={number}
            id={number}
            onClick={handleClick}
            className={currentPage === number ? 'active' : null}
        >
            {number}
        </li>
    ));

    return (
        <div>
            <h2>{language === 'en' ? 'Patient Tests' : 'Badania pacjenta'}</h2>
            <ul className="custom-list">
                {renderItems}
            </ul>
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
        </div>
    );
}

export default PatientTests;
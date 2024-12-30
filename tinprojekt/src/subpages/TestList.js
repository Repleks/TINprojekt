import React, { useState } from 'react';
import data from '../database.json';

function TestList() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const { Badanie } = data;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Badanie.slice(indexOfFirstItem, indexOfLastItem);

    const renderItems = currentItems.map((item, index) => {
        return (
            <li key={index}>
                <p>Nazwa Badania: {item.NazwaBadania}</p>
                <p>Koszt: {item.Koszt}</p>
                <p>Opis Badania: {item.OpisBadania}</p>
            </li>
        );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(Badanie.length / itemsPerPage); i++) {
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
            <h2>Tutaj lista badań</h2>
            <ul>
                {renderItems}
            </ul>
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
        </div>
    );
}

export default TestList;
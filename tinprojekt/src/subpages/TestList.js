import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../database.json';

function TestList({ userRole }) {
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
                {userRole === 'admin' && <Link to={`/modifytestinfo/${item.Badanie_ID}`}><button>Modify Test</button></Link>}
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
            <ul className="custom-list">
                {renderItems}
            </ul>
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
            {userRole === 'admin' && <Link to="/addtest"><button>Add New Test</button></Link>}
        </div>
    );
}

export default TestList;
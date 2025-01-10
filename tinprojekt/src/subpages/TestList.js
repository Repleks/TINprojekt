import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TestList({ userRole }) {
    const [tests, setTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        axios.get('http://localhost:3001/api/get/tests')
            .then(response => {
                setTests(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tests!', error);
            });
    }, []);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const handleDelete = (testId) => {
        axios.post(`http://localhost:3001/api/post/test/${testId}/delete`)
            .then(response => {
                console.log('Test cost updated to 0:', response.data);
                setTests(tests.map(test => test.Badanie_ID === testId ? { ...test, Koszt: 0 } : test));
            })
            .catch(error => {
                console.error('There was an error updating the test cost!', error);
            });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tests.slice(indexOfFirstItem, indexOfLastItem);

    const renderItems = currentItems.map((item, index) => {
        return (
            <li key={index}>
                {userRole === 2 && <p>ID: {item.Badanie_ID}</p>}
                <p>Nazwa Badania: {item.NazwaBadania}</p>
                <p>Koszt: {item.Koszt}</p>
                <p>Opis Badania: {item.OpisBadania}</p>
                {userRole === 2 && (
                    <>
                        <Link to={`/modifytestinfo/${item.Badanie_ID}`}><button>Modify Test</button></Link>
                        <button onClick={() => handleDelete(item.Badanie_ID)}>Delete Test</button>
                    </>
                )}
            </li>
        );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tests.length / itemsPerPage); i++) {
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
            {userRole === 2 && <Link to="/addtest"><button>Add New Test</button></Link>}
        </div>
    );
}

export default TestList;
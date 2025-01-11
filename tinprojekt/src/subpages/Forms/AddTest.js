import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddTest() {
    const [testName, setTestName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3001/api/post/test', { testName, cost, description })
            .then(response => {
                console.log('New Test added successfully:', response.data);
                navigate('/testlist');
            })
            .catch(error => {
                console.error('There was an error adding the test!', error);
            });
    };

    return (
        <div>
            <h2>Add New Test</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Test Name:</label>
                    <input
                        type="text"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Cost:</label>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Test</button>
            </form>
        </div>
    );
}

export default AddTest;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddTest() {
    const [testName, setTestName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!testName) errors.testName = 'Test Name is required';
        if (!cost) errors.cost = 'Cost is required';
        if (isNaN(cost)) errors.cost = 'Cost must be a number';
        if (!description) errors.description = 'Description is required';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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
                    {errors.testName && <p>{errors.testName}</p>}
                </div>
                <div>
                    <label>Cost:</label>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                    {errors.cost && <p>{errors.cost}</p>}
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    {errors.description && <p>{errors.description}</p>}
                </div>
                <button type="submit">Add Test</button>
            </form>
        </div>
    );
}

export default AddTest;
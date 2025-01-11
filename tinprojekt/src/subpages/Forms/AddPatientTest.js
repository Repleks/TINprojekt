import axios from 'axios';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddPatientTest() {
    const { id } = useParams();
    const [testId, setTestId] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!testId) errors.testId = 'Test ID is required';
        if (!date) errors.date = 'Date is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.post(`http://localhost:3001/api/post/patient/${id}/test`, { testId, date })
            .then(response => {
                console.log('Test added successfully:', response.data);
                navigate(`/patientslist`);
            })
            .catch(error => {
                console.error('There was an error adding the test!', error);
            });
    };

    return (
        <div>
            <h2>Add Test for Patient {id}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Test ID:</label>
                    <input type="text" value={testId} onChange={(e) => setTestId(e.target.value)} required />
                    {errors.testId && <p>{errors.testId}</p>}
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    {errors.date && <p>{errors.date}</p>}
                </div>
                <button type="submit">Add Test</button>
            </form>
        </div>
    );
}

export default AddPatientTest;
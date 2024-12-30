import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function AddPatientTest() {
    const { id } = useParams();
    const [testId, setTestId] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Add test', testId, date, 'for patient', id);
    };

    return (
        <div>
            <h2>Add Test for Patient {id}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Test ID:</label>
                    <input type="text" value={testId} onChange={(e) => setTestId(e.target.value)} />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <button type="submit">Add Test</button>
            </form>
        </div>
    );
}

export default AddPatientTest;
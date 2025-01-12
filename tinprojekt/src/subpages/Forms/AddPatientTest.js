import axios from 'axios';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddPatientTest({ language }) {
    const { id } = useParams();
    const [testId, setTestId] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!testId) errors.testId = language === 'en' ? 'Test ID is required' : 'ID badania jest wymagane';
        if (!date) errors.date = language === 'en' ? 'Date is required' : 'Data jest wymagana';
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
            <h2>{language === 'en' ? `Add Test for Patient ${id}` : `Dodaj badanie dla pacjenta ${id}`}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{language === 'en' ? 'Test ID:' : 'ID badania:'}</label>
                    <input type="text" value={testId} onChange={(e) => setTestId(e.target.value)} required />
                    {errors.testId && <p>{errors.testId}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Date:' : 'Data:'}</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    {errors.date && <p>{errors.date}</p>}
                </div>
                <button type="submit">{language === 'en' ? 'Add Test' : 'Dodaj badanie'}</button>
            </form>
        </div>
    );
}

export default AddPatientTest;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddTest({ language }) {
    const [testName, setTestName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!testName) errors.testName = language === 'en' ? 'Test Name is required' : 'Nazwa badania jest wymagana';
        if (!cost) errors.cost = language === 'en' ? 'Cost is required' : 'Koszt jest wymagany';
        if (isNaN(cost)) errors.cost = language === 'en' ? 'Cost must be a number' : 'Koszt musi być liczbą';
        if (!description) errors.description = language === 'en' ? 'Description is required' : 'Opis jest wymagany';
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
            <h2>{language === 'en' ? 'Add New Test' : 'Dodaj nowe badanie'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{language === 'en' ? 'Test Name:' : 'Nazwa badania:'}</label>
                    <input
                        type="text"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        required
                    />
                    {errors.testName && <p>{errors.testName}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Cost:' : 'Koszt:'}</label>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                    {errors.cost && <p>{errors.cost}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Description:' : 'Opis:'}</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    {errors.description && <p>{errors.description}</p>}
                </div>
                <button type="submit">{language === 'en' ? 'Add Test' : 'Dodaj badanie'}</button>
            </form>
        </div>
    );
}

export default AddTest;
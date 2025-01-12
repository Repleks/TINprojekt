import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModifyTestInfo({ language }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3001/api/get/tests`)
            .then(response => {
                const testData = response.data.find(b => b.Badanie_ID === parseInt(id));
                setTest(testData);
            })
            .catch(error => {
                console.error('There was an error fetching the test info!', error);
            });
    }, [id]);

    const validate = () => {
        const errors = {};
        if (!test.NazwaBadania) errors.testName = language === 'en' ? 'Test Name is required' : 'Nazwa badania jest wymagana';
        if (!test.Koszt) errors.cost = language === 'en' ? 'Cost is required' : 'Koszt jest wymagany';
        if (isNaN(test.Koszt)) errors.cost = language === 'en' ? 'Cost must be a number' : 'Koszt musi być liczbą';
        if (!test.OpisBadania) errors.description = language === 'en' ? 'Description is required' : 'Opis jest wymagany';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.put(`http://localhost:3001/api/put/test/${id}`, {
            testName: test.NazwaBadania,
            cost: test.Koszt,
            description: test.OpisBadania
        })
            .then(response => {
                console.log('Test updated successfully:', response.data);
                navigate('/testlist');
            })
            .catch(error => {
                console.error('There was an error updating the test!', error);
            });
    };

    if (!test) {
        return <div>{language === 'en' ? 'Loading...' : 'Ładowanie...'}</div>;
    }

    return (
        <div>
            <h2>{language === 'en' ? 'Modify Test Info' : 'Modyfikuj informacje o badaniu'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{language === 'en' ? 'Test Name:' : 'Nazwa badania:'}</label>
                    <input type="text" value={test.NazwaBadania} onChange={(e) => setTest({ ...test, NazwaBadania: e.target.value })} />
                    {errors.testName && <p>{errors.testName}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Cost:' : 'Koszt:'}</label>
                    <input type="number" value={test.Koszt} onChange={(e) => setTest({ ...test, Koszt: e.target.value })} />
                    {errors.cost && <p>{errors.cost}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Description:' : 'Opis:'}</label>
                    <input type="text" value={test.OpisBadania} onChange={(e) => setTest({ ...test, OpisBadania: e.target.value })} />
                    {errors.description && <p>{errors.description}</p>}
                </div>
                <button type="submit">{language === 'en' ? 'Save Changes' : 'Zapisz zmiany'}</button>
            </form>
        </div>
    );
}

export default ModifyTestInfo;
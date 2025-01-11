import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModifyTestInfo() {
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
        if (!test.NazwaBadania) errors.testName = 'Test Name is required';
        if (!test.Koszt) errors.cost = 'Cost is required';
        if (isNaN(test.Koszt)) errors.cost = 'Cost must be a number';
        if (!test.OpisBadania) errors.description = 'Description is required';
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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Modify Test Info</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={test.NazwaBadania} onChange={(e) => setTest({ ...test, NazwaBadania: e.target.value })} />
                    {errors.testName && <p>{errors.testName}</p>}
                </div>
                <div>
                    <label>Cost:</label>
                    <input type="number" value={test.Koszt} onChange={(e) => setTest({ ...test, Koszt: e.target.value })} />
                    {errors.cost && <p>{errors.cost}</p>}
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={test.OpisBadania} onChange={(e) => setTest({ ...test, OpisBadania: e.target.value })} />
                    {errors.description && <p>{errors.description}</p>}
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyTestInfo;
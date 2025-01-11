import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModifyPatientInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3001/api/get/patient/${id}/info`)
            .then(response => {
                setPatient(response.data);
                setUser(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the patient info!', error);
            });
    }, [id]);

    const validate = () => {
        const errors = {};
        if (!user.Imie) errors.firstName = 'First Name is required';
        if (!user.Nazwisko) errors.lastName = 'Last Name is required';
        if (!user.Email) errors.email = 'Email is required';
        if (!patient.PESEL) errors.pesel = 'PESEL is required';
        if (isNaN(user.Wiek)) errors.age = 'Age must be a number';
        if(user.Wiek < 0) errors.age = 'Age must be a positive number';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.put(`http://localhost:3001/api/put/patient/${id}`, {
            firstName: user.Imie,
            lastName: user.Nazwisko,
            email: user.Email,
            age: user.Wiek,
            pesel: patient.PESEL
        })
            .then(response => {
                console.log('Patient updated successfully:', response.data);
                navigate(`/patientinfo/${id}`);
            })
            .catch(error => {
                console.error('There was an error updating the patient!', error);
            });
    };

    if (!patient || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Modify Patient Info</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={user.Imie} onChange={(e) => setUser({ ...user, Imie: e.target.value })} />
                    {errors.firstName && <p>{errors.firstName}</p>}
                </div>
                <div>
                    <label>Surname:</label>
                    <input type="text" value={user.Nazwisko} onChange={(e) => setUser({ ...user, Nazwisko: e.target.value })} />
                    {errors.lastName && <p>{errors.lastName}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={user.Email} onChange={(e) => setUser({ ...user, Email: e.target.value })} />
                    {errors.email && <p>{errors.email}</p>}
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" value={user.Wiek} onChange={(e) => setUser({ ...user, Wiek: e.target.value })} />
                    {errors.age && <p>{errors.age}</p>}
                </div>
                <div>
                    <label>PESEL:</label>
                    <input type="text" value={patient.PESEL} onChange={(e) => setPatient({ ...patient, PESEL: e.target.value })} />
                    {errors.pesel && <p>{errors.pesel}</p>}
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyPatientInfo;
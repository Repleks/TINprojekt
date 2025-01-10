import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModifyPatientInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [user, setUser] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
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
                </div>
                <div>
                    <label>Surname:</label>
                    <input type="text" value={user.Nazwisko} onChange={(e) => setUser({ ...user, Nazwisko: e.target.value })} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={user.Email} onChange={(e) => setUser({ ...user, Email: e.target.value })} />
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" value={user.Wiek} onChange={(e) => setUser({ ...user, Wiek: e.target.value })} />
                </div>
                <div>
                    <label>PESEL:</label>
                    <input type="text" value={patient.PESEL} onChange={(e) => setPatient({ ...patient, PESEL: e.target.value })} />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyPatientInfo;
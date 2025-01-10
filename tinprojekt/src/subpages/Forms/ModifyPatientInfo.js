import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../database.json';

function ModifyPatientInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const patient = data.Pacjent.find(p => p.Pacjent_ID === parseInt(id));
    const user = data.Uzytkownik.find(u => u.Uzytkownik_ID === patient.Uzytkownik_ID);

    const [name, setName] = useState(user.Imie);
    const [surname, setSurname] = useState(user.Nazwisko);
    const [email, setEmail] = useState(user.Email);
    const [age, setAge] = useState(user.Wiek);
    const [pesel, setPesel] = useState(patient.PESEL);

    const handleSubmit = (e) => {
        e.preventDefault();
        // jakaś logika tu kiedyś będzie
        console.log(`Updated patient ${id} info: ${name}, ${surname}, ${email}, ${age}, ${pesel}`);
        navigate(`/patientinfo/${id}`);
    };

    return (
        <div>
            <h2>Modify Patient Info</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Surname:</label>
                    <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div>
                    <label>PESEL:</label>
                    <input type="text" value={pesel} onChange={(e) => setPesel(e.target.value)} />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyPatientInfo;
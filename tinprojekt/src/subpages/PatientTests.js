import React from 'react';
import data from '../database.json';

function PatientTests() {
    const userId = 1; // Assuming the logged-in user has ID 1
    const patient = data.Pacjent.find(p => p.Uzytkownik_ID === userId);
    const patientTests = data.Pacjent_Badanie.filter(pb => pb.Pacjent_ID === patient.Pacjent_ID);

    return (
        <div>
            <h2>Patient Tests</h2>
            <ul>
                {patientTests.map(test => {
                    const testDetails = data.Badanie.find(b => b.Badanie_ID === test.Badanie_ID);
                    return (
                        <li key={test.Pacjent_Badanie_ID}>
                            <p>Test Name: {testDetails.NazwaBadania}</p>
                            <p>Cost: {testDetails.Koszt}</p>
                            <p>Description: {testDetails.OpisBadania}</p>
                            <p>Date: {test.DataBadania}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default PatientTests;
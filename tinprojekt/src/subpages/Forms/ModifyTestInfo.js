import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../database.json';

function ModifyTestInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const test = data.Badanie.find(b => b.Badanie_ID === parseInt(id));

    const [name, setName] = useState(test.NazwaBadania);
    const [cost, setCost] = useState(test.Koszt);
    const [description, setDescription] = useState(test.OpisBadania);

    const handleSubmit = (e) => {
        e.preventDefault();
        // jakaś logika tu kiedyś będzie
        console.log(`Updated test ${id} info: ${name}, ${cost}, ${description}`);
        navigate('/testlist');
    };

    return (
        <div>
            <h2>Modify Test Info</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Cost:</label>
                    <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default ModifyTestInfo;
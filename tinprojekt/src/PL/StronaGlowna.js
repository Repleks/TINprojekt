import React, { useState } from 'react';
import { Route, Link, Routes, useNavigate } from 'react-router-dom';
import './StronaGlowna.css';
import BadaniaPacjenta from './Podstrony/BadaniaPacjenta';
import InformacjePacjenta from './Podstrony/InformacjePacjenta';
import ListaBadan from './Podstrony/ListaBadan';
import ListaPacjentow from './Podstrony/ListaPacjentow';
import Login from './Podstrony/Formularze/Zaloguj';
import Register from './Podstrony/Formularze/Zarejestruj';
import AddPatientTest from '../Subpages/Forms/AddPatientTest';
import ModifyPatientInfo from '../Subpages/Forms/ModifyPatientInfo';
import ModifyTestInfo from '../Subpages/Forms/ModifyTestInfo';
import AddTest from '../Subpages/Forms/AddTest';
import axios from 'axios';

function StronaGlowna() {
    const [userRole, setUserRole] = useState(null);
    const [patientId, setPatientId] = useState(null);

    const handleLogin = (username, password) => {
        axios.post('http://localhost:3001/api/post/login', { username, password })
            .then(response => {
                const { Uzytkownik_ID, PoziomDostepu } = response.data;
                setUserRole(PoziomDostepu);
                setPatientId(Uzytkownik_ID);
            })
            .catch(error => {
                console.error('Login failed:', error);
            });
    };

    const handleUpgradeAccess = (userId) => {
        axios.put(`http://localhost:3001/api/put/user/${userId}/access`)
            .then(response => {
                console.log('User access level updated:', response.data);
            })
            .catch(error => {
                console.error('There was an error updating the user access level!', error);
            });
    };

    console.log('Strona glowna rendered')

    return (
        <div className="App">
            <nav className="custom-nav">
                <ul>
                    <li><Link to="/">Strona Główna</Link></li>
                    <li><Link to="/pl/listabadan">Lista Badań</Link></li>
                    {userRole === 1 && <li><Link to={`/pl/badaniapacjenta/${patientId}`}>Badania Pacjenta</Link></li>}
                    {userRole === 1 && <li><Link to={`/pl/informacjepacjenta/${patientId}`}>Informacje o Pacjencie</Link></li>}
                    {userRole === 2 && <li><Link to="/pl/listapacjentow">Lista Pacjentów</Link></li>}
                    {userRole ? (
                        <li className="right"><LogoutButton setUserRole={setUserRole} setPatientId={setPatientId}/></li>
                    ) : (
                        <>
                            <li className="right"><Link to="/pl/zaloguj">Zaloguj się</Link></li>
                            <li className="right"><Link to="/pl/zarejestruj">Zarejestruj się</Link></li>
                        </>
                    )}
                    <li><Link to="/">Change language to English</Link></li>
                </ul>
            </nav>
            {userRole === 1 && (
                <button onClick={() => handleUpgradeAccess(patientId)}>Uzyskaj dostęp administratora</button>
            )}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/pl/listabadan" element={<ListaBadan userRole={userRole}/>}/>
                <Route path="/pl/zaloguj" element={<Login onLogin={handleLogin}/>}/>
                <Route path="/pl/zarejestruj" element={<Register/>}/>
                <Route path="/pl/badaniapacjenta/:id" element={<BadaniaPacjenta />} />
                <Route path="/pl/listapacjentow" element={<ListaPacjentow/>}/>
                <Route path="/pl/informacjepacjenta/:id" element={<InformacjePacjenta />} />
                <Route path="/addpatienttest/:id" element={<AddPatientTest />} />
                <Route path="/modifypatientinfo/:id" element={<ModifyPatientInfo />} />
                <Route path="/modifytestinfo/:id" element={<ModifyTestInfo />} />
                <Route path="/addtest" element={<AddTest />} />
            </Routes>
        </div>
    );
}

function Home() {
    return (
        <div className="home">
            <h1>Klinika medyczna</h1>
            <h3>Lista dostępnych badań</h3>
            <Link to="/pl/listabadan">
                <a href="/pl/listabadan">Przejdź do listy badań</a>
            </Link>
        </div>
    );
}

function LogoutButton({ setUserRole, setPatientId }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserRole(null);
        setPatientId(null);
        navigate('/');
    };

    return (
        <button className="nav-button" onClick={handleLogout}>Wyloguj się</button>
    );
}

export default StronaGlowna;
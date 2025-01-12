import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import TestList from './Subpages/TestList';
import Login from './Subpages/Forms/Login';
import Register from './Subpages/Forms/Register';
import PatientTests from './Subpages/PatientTests';
import PatientsList from './Subpages/PatientsList';
import PatientInfo from './Subpages/PatientInfo';
import AddPatientTest from './Subpages/Forms/AddPatientTest';
import ModifyPatientInfo from './Subpages/Forms/ModifyPatientInfo';
import ModifyTestInfo from './Subpages/Forms/ModifyTestInfo';
import AddTest from './Subpages/Forms/AddTest';
import axios from 'axios';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [language, setLanguage] = useState('en'); // Language state

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

    const toggleLanguage = () => {
        setLanguage(prevLanguage => (prevLanguage === 'en' ? 'pl' : 'en'));
    };

    return (
        <Router>
            <div className="App">
                <nav className="custom-nav">
                    <ul>
                        <li><Link to="/">{language === 'en' ? 'Main Page' : 'Strona Główna'}</Link></li>
                        <li><Link to="/testlist">{language === 'en' ? 'Tests list' : 'Lista badań'}</Link></li>
                        {userRole === 1 && <li><Link to={`/patienttests/${patientId}`}>{language === 'en' ? 'Patient Tests' : 'Badania pacjenta'}</Link></li>}
                        {userRole === 1 && <li><Link to={`/patientinfo/${patientId}`}>{language === 'en' ? 'Patient Info' : 'Informacje o pacjencie'}</Link></li>}
                        {userRole === 2 && <li><Link to="/patientslist">{language === 'en' ? 'Patients List' : 'Lista pacjentów'}</Link></li>}
                        {userRole ? (
                            <li className="right"><LogoutButton setUserRole={setUserRole} setPatientId={setPatientId} language={language} /></li>
                        ) : (
                            <>
                                <li className="right"><Link to="/login">{language === 'en' ? 'Login' : 'Zaloguj się'}</Link></li>
                                <li className="right"><Link to="/register">{language === 'en' ? 'Register' : 'Zarejestruj się'}</Link></li>
                            </>
                        )}
                        <li className="right">
                            <button className="nav-button" onClick={toggleLanguage}>{language === 'en' ? 'Toggle Language' : 'Zmień język'}</button>
                        </li>
                    </ul>
                </nav>
                {userRole === 1 && (
                    <button onClick={() => handleUpgradeAccess(patientId)}>{language === 'en' ? 'Gain Admin Access' : 'Uzyskaj dostęp administratora'}</button>
                )}
                <Routes>
                    <Route path="/" element={language === 'en' ? <HomeEn /> : <HomePl />} />
                    <Route path="/testlist" element={<TestList userRole={userRole} language={language} />}/>
                    <Route path="/login" element={<Login onLogin={handleLogin} language={language} />}/>
                    <Route path="/register" element={<Register language={language} />}/>
                    <Route path="/patienttests/:id" element={<PatientTests userId={patientId} language={language} />} />
                    <Route path="/patientslist" element={<PatientsList language={language} />}/>
                    <Route path="/patientinfo/:id" element={<PatientInfo userId={patientId} language={language} />} />
                    <Route path="/addpatienttest/:id" element={<AddPatientTest language={language} />} />
                    <Route path="/modifypatientinfo/:id" element={<ModifyPatientInfo language={language} />} />
                    <Route path="/modifytestinfo/:id" element={<ModifyTestInfo language={language} />} />
                    <Route path="/addtest" element={<AddTest language={language} />} />
                </Routes>
            </div>
        </Router>
    );
}

function HomeEn() {
    return (
        <div className="home">
            <h1>Medical Clinic</h1>
            <h3>List of available tests</h3>
            <Link to="/testlist">Go to the list of tests</Link>
        </div>
    );
}

function HomePl() {
    return (
        <div className="home">
            <h1>Klinika medyczna</h1>
            <h3>Lista dostępnych badań</h3>
            <Link to="/testlist">Przejdź do listy badań</Link>
        </div>
    );
}

function LogoutButton({ setUserRole, setPatientId, language }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserRole(null);
        setPatientId(null);
        navigate('/');
    };

    return (
        <button className="nav-button" onClick={handleLogout}>{language === 'en' ? 'Logout' : 'Wyloguj się'}</button>
    );
}

export default App;
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

    return (
        <Router>
            <div className="App">
                <nav className="custom-nav">
                    <ul>
                        <li><Link to="/">Main Page</Link></li>
                        <li><Link to="/testlist">Tests list</Link></li>
                        {userRole === 1 && <li><Link to={`/patienttests/${patientId}`}>Patient Tests</Link></li>}
                        {userRole === 1 && <li><Link to={`/patientinfo/${patientId}`}>Patient Info</Link></li>}
                        {userRole === 2 && <li><Link to="/patientslist">Patients List</Link></li>}
                        {userRole ? (
                            <li className="right"><LogoutButton setUserRole={setUserRole} setPatientId={setPatientId}/></li>
                        ) : (
                            <>
                                <li className="right"><Link to="/login">Login</Link></li>
                                <li className="right"><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
                {userRole === 1 && (
                    <button onClick={() => handleUpgradeAccess(patientId)}>Gain Admin Access</button>
                )}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/testlist" element={<TestList userRole={userRole}/>}/>
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/patienttests/:id" element={<PatientTests userId={patientId} />} />
                    <Route path="/patientslist" element={<PatientsList/>}/>
                    <Route path="/patientinfo/:id" element={<PatientInfo userId={patientId} />} />
                    <Route path="/addpatienttest/:id" element={<AddPatientTest />} />
                    <Route path="/modifypatientinfo/:id" element={<ModifyPatientInfo />} />
                    <Route path="/modifytestinfo/:id" element={<ModifyTestInfo />} />
                    <Route path="/addtest" element={<AddTest />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div className="home">
            <h1>Klinika medyczna</h1>
            <h3>Lista dostępnych badań</h3>
            <Link to="/testlist">Przejdź do listy badań</Link>
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
        <button className="nav-button" onClick={handleLogout}>Logout</button>
    );
}

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import TestList from './Subpages/TestList';
import Login from './Subpages/Login';
import Register from './Subpages/Register';
import PatientTests from './Subpages/PatientTests';
import PatientsList from './Subpages/PatientsList';
import PatientInfo from './Subpages/PatientInfo';
import AddPatientTest from './Subpages/AddPatientTest';
import ModifyPatientInfo from './Subpages/ModifyPatientInfo';
import ModifyTestInfo from './Subpages/ModifyTestInfo';

function App() {
    const [userRole, setUserRole] = useState(null);

    const handleLogin = (username, password) => {
        if (username === 'admin' && password === 'admin') {
            setUserRole('admin');
        } else if (username === 'user' && password === 'user') {
            setUserRole('user');
        }
    };

    return (
        <Router>
            <div className="App">
                <nav className="custom-nav">
                    <ul>
                        <li><Link to="/">Main Page</Link></li>
                        <li><Link to="/testlist">Tests list</Link></li>
                        {userRole === 'user' && <li><Link to="/patienttests/1">Patient Tests</Link></li>}
                        {userRole === 'user' && <li><Link to="/patientinfo/1">Patient Info</Link></li>}
                        {userRole === 'admin' && <li><Link to="/patientslist">Patients List</Link></li>}
                        {userRole ? (
                            <li className="right"><LogoutButton setUserRole={setUserRole}/></li>
                        ) : (
                            <>
                                <li className="right"><Link to="/login">Login</Link></li>
                                <li className="right"><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/testlist" element={<TestList userRole={userRole}/>}/>
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/patienttests/:id"
                           element={(userRole === 'user' || userRole === "admin") ? <PatientTests/> :
                               <Navigate to="/login"/>}/>
                    <Route path="/patientslist"
                           element={(userRole === 'user' || userRole === "admin") ? <PatientsList/> :
                               <Navigate to="/login"/>}/>
                    <Route path="/patientinfo/:id" element={(userRole === 'user' || userRole === "admin") ? <PatientInfo /> : <Navigate to="/login" />} />
                    <Route path="/addpatienttest/:id" element={(userRole === 'user' || userRole ==="admin") ? <AddPatientTest /> : <Navigate to="/login" />} />
                    <Route path="/modifypatientinfo/:id" element={(userRole === 'user' || userRole ==="admin") ? <ModifyPatientInfo /> : <Navigate to="/login" />} />
                    <Route path="/modifytestinfo/:id" element={userRole === 'admin' ? <ModifyTestInfo /> : <Navigate to="/login" />} />
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
            <Link to="/testlist">
                <a href="/testlist">Przejdź do listy badań</a>
            </Link>
        </div>
    );
}

function LogoutButton({ setUserRole }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserRole(null);
        navigate('/');
    };

    return (
        <button className="nav-button" onClick={handleLogout}>Logout</button>
    );
}

export default App;
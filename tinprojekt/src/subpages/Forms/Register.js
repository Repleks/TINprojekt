import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({ language }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!username) errors.username = language === 'en' ? 'Username is required' : 'Nazwa użytkownika jest wymagana';
        if (!password) errors.password = language === 'en' ? 'Password is required' : 'Hasło jest wymagane';
        if (password.length < 4) errors.password = language === 'en' ? 'Password must be at least 4 characters long' : 'Hasło musi mieć co najmniej 4 znaki';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.post('http://localhost:3001/api/post/register', { username, password })
            .then(response => {
                console.log('User registered:', response.data);
                navigate('/');
            })
            .catch(error => {
                console.error('There was an error registering the user!', error);
            });
    };

    return (
        <div>
            <h2>{language === 'en' ? 'Register Page' : 'Strona rejestracji'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{language === 'en' ? 'Username:' : 'Nazwa użytkownika:'}</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    {errors.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Password:' : 'Hasło:'}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button type="submit">{language === 'en' ? 'Register' : 'Zarejestruj się'}</button>
            </form>
        </div>
    );
}

export default Register;
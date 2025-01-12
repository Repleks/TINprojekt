import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin, language }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!username) errors.username = language === 'en' ? 'Username is required' : 'Nazwa użytkownika jest wymagana';
        if (!password) errors.password = language === 'en' ? 'Password is required' : 'Hasło jest wymagane';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onLogin(username, password);
        navigate('/');
    };

    return (
        <div>
            <h2>{language === 'en' ? 'Login Page' : 'Strona logowania'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{language === 'en' ? 'Username:' : 'Nazwa użytkownika:'}</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    {errors.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <label>{language === 'en' ? 'Password:' : 'Hasło:'}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button type="submit">{language === 'en' ? 'Login' : 'Zaloguj się'}</button>
            </form>
        </div>
    );
}

export default Login;
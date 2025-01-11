import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!username) errors.username = 'Username is required';
        if (!password) errors.password = 'Password is required';
        if (password.length < 4) errors.password = 'Password must be at least 4 characters long';
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
            <h2>Register Page</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    {errors.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {errors.password && <p>{errors.password}</p>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
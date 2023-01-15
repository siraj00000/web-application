import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { actionPost } from '../../../utils/userActions';
import swal from 'sweetalert';
import '../form.css';
import { Alert } from '@mui/material';

const EndUserLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const setLoginCredentials = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const endUserLoginHandler = async (e) => {
        e.preventDefault();
        try {
            let URL = `/api/login-enduser`;
            const response = await actionPost(URL, credentials);
            if (response.data.success) {
                swal("Good job!", "Successfully Logged in", "success");
            }
            localStorage.setItem("endutoken", response?.data?.token);
            navigate("/");
        } catch (err) {
            setError(err);
        }
        setCredentials({ email: "", password: "" });
    };
    return (
        <main>
            <form className='--form-layout -w-half' onSubmit={endUserLoginHandler}>
                <h1>Login</h1>
                {error !== '' && <Alert severity="error">{error}</Alert>}
                <div className='-input-full'>
                    <label>Email</label>
                    <input
                        name='email'
                        type={'email'}
                        placeholder='mark@example.com'
                        value={credentials.email}
                        onChange={setLoginCredentials}
                    />
                </div>
                <div className='-input-full'>
                    <label>Password</label>
                    <input
                        name='password'
                        type={'password'}
                        placeholder='mark!123'
                        value={credentials.password}
                        onChange={setLoginCredentials}
                    />
                </div>
                <button>Login</button>
                <NavLink to="/user/sign-up">Don't have an account? Sign up</NavLink>
            </form>
        </main>
    );
};

export default EndUserLogin;
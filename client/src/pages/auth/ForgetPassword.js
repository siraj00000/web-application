import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import API from '../../API'
import './auth.css';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            document.location = "/ls-admin"
        }
    }, [])

    const forgetPasswordHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const { data } = await API.post("api/auth/forgetpassword", { email }, config)
            if (Object.keys(data).length !== 0) {
                setSuccess(data.data)
            }


        } catch (error) {
            setError(error?.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000)
        }
    }

    return (
        <main>
            <div className='auth-container forget_password'>
                <section className='auth-form-container forget_password_form'>
                    <form onSubmit={forgetPasswordHandler}>
                        {error !== '' && <Alert severity="error">{error}</Alert>}
                        {success !== '' && <Alert severity="success">{success}</Alert>}
                        <h1>Forget Password</h1>
                        <label>Email</label>
                        <input type={'email'} name={'email'} value={email} onChange={e => setEmail(e.target.value)} required placeholder='Email Address' />
                        <button type='submit'>Send</button>
                    </form>
                </section>
            </div>
        </main>
    )
}

export default ForgetPassword
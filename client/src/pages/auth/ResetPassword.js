import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import API from '../../API'
import './auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Getting token from params    
    let { resetToken } = useParams();
    console.log(resetToken);
    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            document.location = "/ls-admin"
        }
    }, [])

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords don't match");
        }
        try {
            const { data } = await API.put(`api/auth/resetpassword/${resetToken}`, { password }, config)
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
                    <form onSubmit={resetPasswordHandler}>
                        {error !== '' && <Alert severity="error">{error}</Alert>}
                        {success !== '' && <Alert severity="success" style={{position: "relative"}}>{success}
                            <NavLink to='/ls-admin/login' className='login_link'>Login</NavLink>
                        </Alert>}
                        <h1>Reset Password</h1>
                        <label>New Password</label>
                        <input type={'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder='New Password' />
                        <label>Confirm New Password</label>
                        <input type={'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder='Confirm New Password' />
                        <button type='submit'>Reset Password</button>
                    </form>
                </section>
            </div>
        </main>
    )
}

export default ResetPassword
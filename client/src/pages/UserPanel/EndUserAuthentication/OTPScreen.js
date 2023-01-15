import { Alert } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { actionPost } from '../../../utils/userActions';
import '../form.css';

const OTPScreen = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [otp, setOTP] = useState("");
    const [error, setError] = useState("");

    const handleOTPVerification = async (e) => {
        e.preventDefault();
        try {
            let URL = `/api/verify-otp`;
            const response = await actionPost(URL, { otp, user_id: state?.user_id });
            swal("Good job!", response?.data?.msg, "success");
            navigate("/user/login")
        } catch (err) {
            setError(err);
        }
    };

    const handleResendOTP = async (e) => {
        e.preventDefault();
        try {
            let URL = `/api/resend-otp`;
            await actionPost(URL, { email: state?.email, user_id: state?.user_id });

        } catch (err) {
            setError(err);
        }
    };

    return (
        <main>
            <form className='--form-layout -w-half' onSubmit={handleOTPVerification}>
                <h1>OTP Verification</h1>
                {error !== '' && <Alert severity="error">{error}</Alert>}
                <div>
                    <label>OTP</label>
                    <input
                        name='otp'
                        placeholder='****'
                        value={otp}
                        onChange={e => setOTP(e.target.value)}
                    />
                </div>
                <button>Verify OTP</button>
                <button
                    type='button'
                    onClick={handleResendOTP}
                    className='-resend-otp-btn'
                >resend otp?</button>
                <p>OTP sent to <strong>{state?.email}</strong></p>
            </form>
        </main>
    );
};

export default OTPScreen;
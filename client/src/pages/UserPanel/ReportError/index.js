import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { actionPost } from '../../../utils/userActions';

const ErrorReporting = () => {
    let navigate = useNavigate();
    const { state } = useLocation();
    const [values, setValues] = useState({
        store_and_location: "",
        purchase_date: "",
        store_pin_code: "",
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleReportErrorSubmittion = async (e) => {
        e.preventDefault();
        try {
            const response = await actionPost("/api/error-report", { ...state, ...values });
            swal("Error Reported!", response.data.msg, "success")
                .then(() => navigate(-1, { replace: true }));
        } catch (error) {
            swal("Failed", error, "error");
        }
    };
    return (
        <main>
            <form onSubmit={handleReportErrorSubmittion} className="--form-layout --report-form">
                <h1>Report Error</h1>
                <div>
                    <label>Store & Location</label>
                    <input
                        placeholder='block #02 near garden east'
                        name="store_and_location"
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label>purchase_date</label>
                    <input
                        type='date'
                        placeholder='02/03/2010'
                        name="purchase_date"
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label>store_pin_code</label>
                    <input
                        placeholder='44223'
                        name="store_pin_code"
                        onChange={onChange}
                    />
                </div>
                <button>Submit</button>
            </form>
        </main>
    );
};

export default ErrorReporting;
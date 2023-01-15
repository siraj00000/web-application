import React from 'react';
import { Alert } from '@mui/material';
import { useState } from 'react';
import CustomizeTitle from '../../../../../mui_theme/title';
import { CompanyAdminRegistration, fetchCompany } from '../../../../../utils/actions/companyData';
import '../../../../auth/auth.css';

import '../admin.css';
import { removeStatus, token } from '../../../../../utils/actions';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Splash from '../../../../../components/splash';

const RegisterCompanyAdmin = () => {
    let nav = useNavigate();
    // Field States
    const [isLoading, setLoading] = useState(false);
    const [company, setCompany] = useState([]);
    const [company_email, setCompanyEmail] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    React.useEffect(() => {
        try {
            let companyURL = `/api/fetch-company-admin`
            fetchCompany(token, companyURL)
                .then(res => {
                    setCompany(res.data?.data);
                })
                .catch(error => {
                    setError(error?.response.data.error);
                    removeStatus(setError);
                });
        } catch (error) {
            setError(error);
            removeStatus(setError);
        }
    }, []);
 
    const registerAdmin = async (e) => {
        e.preventDefault();
        // Password Verification
        if (password.length < 5) {
            setError("Password must contain at least 6 digits");
            removeStatus(setError);
            return false;
        };
        setLoading(true)
        // Data posting
        let bodyData = { email, password, role: 2, company_email };
        CompanyAdminRegistration(token, bodyData)
            .then(res => {
                swal({
                    title: "Success!",
                    text: res?.data?.msg,
                    icon: "success",
                    button: "Okay!",
                }).then(() => {
                    nav('/ls-admin/admins', { replace: true });
                    setLoading(false);
                });
            })
            .catch(error => {
                setError(error);
                removeStatus(setError);
                setLoading(false);
            });
    };
    if (isLoading) return <Splash loading={isLoading} />;
    return (
        <form className='form-sec' onSubmit={registerAdmin}>
            <CustomizeTitle text={'Register Company Admin'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form'>
                <div className='company_admin_form_field'>
                    <label>email</label>
                    <input type={'email'} placeholder='mark@example' value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className='company_admin_form_field'>
                    <label>password</label>
                    <input type={'password'} placeholder='mark123' value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className='company_admin_form_field'>
                    <label>Company</label>
                    <select onChange={(e) => setCompanyEmail(e.target.value)} required>
                        <option value="">select company</option>
                        {company?.map((item, index) => {
                            return (
                                <option
                                    key={index}
                                    value={item?.company_email}
                                    className='company_list'>
                                    {item?.company_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <button>Register Company Admin</button>
        </form>
    );
};

export default RegisterCompanyAdmin;

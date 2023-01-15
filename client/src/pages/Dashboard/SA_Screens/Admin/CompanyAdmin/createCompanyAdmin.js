import React, { useEffect, useState } from 'react';
import { fetchSubCategory } from '../../../../../utils/actions/category';
import { CompanyAdminInsert } from '../../../../../utils/actions/companyData';
import { removeStatus, token } from '../../../../../utils/actions';
import Alert from '@mui/material/Alert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CustomizeTitle from '../../../../../mui_theme/title';
import '../../../../auth/auth.css';
import '../admin.css';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import Splash from '../../../../../components/splash';

const CreateCompanyAdmin = () => {
    let nav = useNavigate();
    // Field States
    const [isLoading, setLoading] = useState(false);
    const [company_email, setCompanyEmail] = useState('');
    const [company_name, setCompanyName] = useState('');
    const [pincode, setPincode] = useState(0);
    const [phone_one, setPhoneOne] = useState(0);
    const [phone_two, setPhoneTwo] = useState(0);
    const [registered_address, setRegisteredAddress] = useState('');
    const [estaiblishment_year, setEstaiblishmentYear] = useState('');
    const [company_active_status, setCompanyActiveStatus] = useState(true);
    const [sub_category, setSubCategory] = useState([]);
    const [category, setCategory] = useState([]);

    const [error, setError] = useState('');
    let URL = `/api/fetch-subcategory`;

    useEffect(() => {
        try {
            fetchSubCategory(token, URL)
                .then(res => {
                    if (!res?.data.success) return setError("404");
                    setCategory(res.data?.data);
                })
                .catch(err => setError(err));
        } catch (error) {
            setError(error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }, []);

    const verifyFieldValues = () => {
        if (pincode.length !== 6) {
            setError("Pincode must have 6 digits");
            removeStatus(setError);
            return false;
        } else if (phone_one.length > 10 || phone_two.length > 10) {
            setError("Phone number exceeding from 10 digits");
            removeStatus(setError);
            return false;
        } else return true;
    };
    const insertCompanyAdmin = async (e) => {
        e.preventDefault();
        let verify = verifyFieldValues();
        if (!verify) return false;
        
        try {
            setLoading(true);
            const bodyData = {
                company_email,
                company_name,
                pincode,
                phone_one,
                phone_two,
                registered_address,
                company_active_status,
                estaiblishment_year,
                sub_category
            };

            CompanyAdminInsert(token, bodyData)
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
        } catch (error) {
            setError(error.message);
        }
    };
    const selectSubCat = (val, index) => {
        let preData = [...category];
        let data = [...sub_category];

        // Remover
        preData.splice(index, 1);
        setCategory(preData);

        // pusher
        data.push(val);
        setSubCategory(data);
    };
    const unSelectSubCat = (val, index) => {
        let data = [...category];
        let preData = [...sub_category];

        // Remover
        preData.splice(index, 1);
        setSubCategory(preData);

        // pusher
        data.push(val);
        setCategory(data);
    };
    const handleChange = (event) => {
        setCompanyActiveStatus(event.target.checked);
    };

    if (error === '404') return <Alert severity="success">No sub-category data found !!</Alert>;

    if (isLoading) return <Splash loading={isLoading} />;

    return (
        <form className='form-sec' onSubmit={insertCompanyAdmin}>
            <CustomizeTitle text={'Add Company'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form'>
                <div className='company_admin_form_field'>
                    <label>Company *</label>
                    <input placeholder='xyz...' value={company_name} onChange={e => setCompanyName(e.target.value)} required />
                </div>
                <div className='company_admin_form_field'>
                    <label>Company Email *</label>
                    <input placeholder='xyz@gmail.com...' value={company_email} onChange={e => setCompanyEmail(e.target.value)} required />
                </div>

                <div className='company_admin_form_field'>
                    <label>Pincode *</label>
                    <input type={'number'} placeholder='392032' value={pincode || ''} onChange={e => setPincode(e.target.value)} required />
                </div>

                <div className='company_admin_form_field'>
                    <label>Registration Address</label>
                    <input placeholder='ABC street' value={registered_address} onChange={e => setRegisteredAddress(e.target.value)} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Phone 1</label>
                    <input placeholder='9132793293' value={phone_one || ''} onChange={e => setPhoneOne(e.target.value)} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Phone 2</label>
                    <input placeholder='9112793293' value={phone_two || ''} onChange={e => setPhoneTwo(e.target.value)} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Estaiblishment Year *</label>
                    <input type={'date'} placeholder='company name' value={estaiblishment_year} onChange={e => setEstaiblishmentYear(e.target.value)} required />
                </div>

                <div className='company_admin_form_field'>
                    <label>Company Status </label>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel
                            name='company_status'
                            control={
                                <Checkbox onChange={handleChange} checked={company_active_status} />
                            }
                            label="Active"
                        />
                    </FormGroup>
                </div>

                <div className='company_admin_form_field'>
                    {sub_category.length !== 0 &&
                        <>
                            <label>Selected Sub Category</label>
                            <div className='sub-catory-list_not_seleted'>
                                {sub_category?.map((item, index) => {
                                    return (
                                        <p
                                            key={index}
                                            onClick={() => unSelectSubCat(item, index)}
                                            className='sub-category-chips _selected'
                                        >{item?.sub_category} <CloseIcon /></p>
                                    );
                                })}
                            </div>
                        </>
                    }
                    {category.length !== 0 &&
                        <>
                            <label>Sub Categories</label>
                            <div className='sub-catory-list_not_seleted'>
                                {category?.map((item, index) => {
                                    return (
                                        <p
                                            key={index}
                                            onClick={() => selectSubCat(item, index)}
                                            className='sub-category-chips _selected'
                                        >{item?.sub_category} <AddIcon /></p>
                                    );
                                })}
                            </div>
                        </>
                    }
                </div>
            </div>
            <button>Create Company</button>
        </form>
    );
};

export default CreateCompanyAdmin;
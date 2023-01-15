import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateCompanyAdmin } from '../../../../../utils/actions/companyData';
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
import { fetchSubCategory } from '../../../../../utils/actions/category';
import Splash from '../../../../../components/splash';
import swal from 'sweetalert';

const EditCompanyAdmin = () => {
    let nav = useNavigate();
    let { state } = useLocation();
    let { data, id } = state;
    // Field States
    const [inputVal, setInputVal] = useState({
        pincode: 0,
        phone_one: 0,
        phone_two: 0,
        registered_address: "",
    });
    const [isLoading, setLoading] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState(data.sub_category);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [company_active_status, setCompanyActiveStatus] = useState(data.company_active_status);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            setInputVal(data);
            fetchSubCategory(token, `/api/fetch-subcategory`)
                .then(res => {
                    let data = res.data;
                    if (!data.success) return setError("404");

                    let subCatList = [];
                    for (let index = 0; index < data?.data.length; index++) {
                        const element = data?.data[index];
                        if (element._id !== selectedSubCategory[0]?._id) {
                            subCatList.push(element);
                        }
                    }
                    setSubCategoryList(subCatList);
                })
                .catch(err => setError(err));
        } catch (error) {
            setError(error);
            removeStatus(setError);
        }
    }, [selectedSubCategory]);

    const setData = (e) => {
        let { name, value } = e.target;
        setInputVal((preval) => {
            return {
                ...preval,
                [name]: value
            };
        });
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        let url = `api/update-company-admin/${id}`;

        const reqBody = {
            pincode: inputVal.pincode,
            phone_one: inputVal.phone_one,
            phone_two: inputVal.phone_two,
            registered_address: inputVal.registered_address,
            sub_category: selectedSubCategory,
            company_active_status,
        };

        updateCompanyAdmin(url, token, reqBody)
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
            }).catch(error => {
                setError(error?.response.data.error);
                setTimeout(() => {
                    setError("");
                }, 5000);
            });
    };

    const handleChange = (event) => {
        setCompanyActiveStatus(event.target.checked);
    };

    const handleCategorySelection = (item) => {
        let subCat = [item];
        setSelectedSubCategory(subCat);
    };

    const removeSubCategory = () => {
        setSelectedSubCategory([]);
    };

    if (isLoading) return <Splash loading={isLoading} />;

    return (
        <form className='form-sec' onSubmit={updateHandler}>
            <CustomizeTitle text={'Edit Company'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='company_admin_form'>
                <div className='company_admin_form_field'>
                    <label>Pincode</label>
                    <input placeholder='392032' name={'pincode'} value={inputVal.pincode || ''} onChange={setData} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Registration Address</label>
                    <input placeholder='ABC street' name={'registered_address'} value={inputVal.registered_address} onChange={setData} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Phone 1</label>
                    <input placeholder='9132793293' name={'phone_one'} value={inputVal.phone_one || ''} onChange={setData} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Phone 2</label>
                    <input placeholder='9112793293' name={'phone_two'} value={inputVal.phone_two || ''} onChange={setData} />
                </div>

                <div className='company_admin_form_field'>
                    <label>Company Status</label>
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
            </div>
            {selectedSubCategory.length !== 0 &&
                <div>
                    <label>Selected Sub Category</label>
                    <div className='sub-catory-list_not_seleted'>
                        <p onClick={removeSubCategory}
                            className='sub-category-chips _selected'
                        >{selectedSubCategory[0]?.sub_category} <CloseIcon /></p>
                    </div>
                </div>}
            {subCategoryList.length !== 0 &&
                < div >
                    <label>Sub Categories</label>
                    <div className='sub-catory-list_not_seleted'>
                        {subCategoryList?.map((item, index) => {
                            return (
                                <p
                                    key={index}
                                    onClick={() => handleCategorySelection(item, index)}
                                    className='sub-category-chips _selected'
                                >{item?.sub_category} <AddIcon /></p>
                            );
                        })}
                    </div>
                </div>
            }
            <button>Update Company</button>
        </form>
    );
};

export default EditCompanyAdmin;
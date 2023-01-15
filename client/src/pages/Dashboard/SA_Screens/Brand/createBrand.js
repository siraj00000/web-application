import React, { useEffect, useState } from 'react';
// @mui
import Alert from '@mui/material/Alert';
import CustomizeTitle from '../../../../mui_theme/title';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
// utils
import { insertBrand } from '../../../../utils/actions/brand';
import { fetchCompany } from '../../../../utils/actions/companyData';
import { removeStatus, token } from '../../../../utils/actions';
// Mui icons
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
// styles
import '../../../auth/auth.css';
import './brand.css';
import '../Admin/admin.css';
import VideoPlayer from '../../../../components/VideoPlayer';
import Splash from '../../../../components/splash';
import swal from 'sweetalert';
import { AppButton } from '../../../../components/StyledComponent';
import { useNavigate } from 'react-router-dom';

const CreateBrand = () => {
    let nav = useNavigate();
    const [isLoading, setLoading] = useState(false);
    // Field States
    const [company, setCompany] = useState([]);
    const [brand, setBrand] = useState('');
    const [company_id, setSelectedCompany] = useState("");
    const [heading, setHeading] = useState("");
    const [text, setText] = useState("");
    const [carousel_headings, setCarouselHeading] = useState([]);
    const [carousel_text, setCarouselText] = useState([]);
    const [product_description, setProductDescription] = useState('');
    const [survey_feature, setSurveyFeature] = useState(false);
    const [survey_link, setSurveyLink] = useState("");
    const [authentication_feature, setAuthenticationFeature] = useState("");
    const [brand_active_status, setBrandActiveStatus] = useState(true);
    const [warranty, setWarranty] = useState(false);
    const [request_help, setRequestHelp] = useState(false);
    const [promo_code, setPromoCode] = useState(false);
    const [referrals, setReferrals] = useState(false);
    const [re_order_link, setReOrderLink] = useState("");
    const [email_support, setEmailSupport] = useState(false);
    const [email_id, setEmailId] = useState("");
    const [call_support, setCallSupport] = useState(false);
    const [call_no, setCallNo] = useState(null);
    const [whatsapp_support, setwhatsappSupport] = useState(false);
    const [whatsapp_number, setwhatsappNumber] = useState(null);
    const [instagram, setInstagram] = useState(false);
    const [insta_link, setInstaLink] = useState("");
    const [facebook, setFacebook] = useState(false);
    const [fb_link, setFbLink] = useState("");
    const [uploadedImageList, setUploadedImageList] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [video_url, setVideo] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [__file, setFile] = useState([]);

    const [error, setError] = useState('');

    useEffect(() => {
        let companyURL = `/api/fetch-company-admin`;
        fetchCompany(token, companyURL)
            .then(res => {
                if (!res.data.success) return setError("404");
                setCompany(res?.data?.data);
            }).catch(error => {
                setError(error);
                setTimeout(() => {
                    setError("");
                }, 5000);
            });
    }, []);

    const validateEmail = () => {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email_id)) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const verifyUploads = () => {
        if (__file.length === 0) {
            setError("Images not found!");
            removeStatus(setError);
            return false;
        } else return true;
    };

    const insertBrandDetail = async (e) => {
        e.preventDefault();

        let emailVerified = validateEmail();
        if (!emailVerified) return;

        //TODO: Verify images and video uploads
        const verify = verifyUploads();
        if (verify) {
            try {
                setLoading(true);
                let emptyVideo = videoURL === '' && selectedVideo === '';
                let reqBody = {
                    company_id, brand, brand_active_status, carousel_headings, carousel_text, product_description, authentication_feature,
                    warranty, request_help, survey_feature, survey_link, promo_code, referrals, re_order_link, email_support, email_id: `mailto:${email_id}`,
                    call_support, call_no: `tel:${call_no}`, whatsapp_support, whatsapp_number: `https://wa.me/${whatsapp_number}`, instagram, insta_link, facebook, fb_link, videoURL, emptyVideo
                };

                const formData = new FormData();
                for (let index = 0; index < __file.length; index++) {
                    formData.append("image", __file[index]);
                }
                formData.append("video", selectedVideo);
                formData.append("reqBody", JSON.stringify(reqBody));

                insertBrand(token, formData)
                    .then(res => {
                        swal({
                            title: "Success!",
                            text: res?.data?.msg,
                            icon: "success",
                            button: "Okay!",
                        }).then(() => {
                            nav('/ls-admin/brands', { replace: true });
                            setLoading(false);
                        });
                    })
                    .catch(error => {
                        setLoading(false);
                        setError(error?.response.data.error);
                        removeStatus(setError);
                    });
            }
            catch (error) {
                setError(error);
                removeStatus(setError);
            }
        }
    };

    const handleAdd = (prevList, val, func, setFunc) => {
        if (!val) return false;
        let list = [...prevList];
        list.push(val);
        func(list);
        setFunc("");
    };

    const handleRemove = (prevList, index, func) => {
        let list = [...prevList];
        list.splice(index, 1);
        func(list);
    };

    const handleUploadImage = event => {
        let files = event.target.files;
        if (Array.from(files).length > 7) {
            swal({
                title: `${files.length} images`,
                text: `Cannot upload images more then 7`,
                icon: `info`,
                buttons: `Try Again`
            });
            return false;
        }

        let images = [];
        let imageDetail = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                swal({
                    title: 'Invalid file format !!',
                    text: `Only jpeg or png are allowed`,
                    icon: `info`,
                    buttons: `Try Again`
                });
                return false;
            }

            images.push(URL.createObjectURL(file));
            imageDetail.push(file);
        }
        setFile(imageDetail);
        setUploadedImageList(images);
    };

    const handleUploadVideo = event => {
        let file = event.target.files[0];
        if (file.size > 50000000) {
            swal({
                title: `${Math.floor((file.size) / 1000000)}MB Size`,
                text: `Cannot upload video upto 50mb`,
                icon: `info`,
                buttons: `Try Again`
            });
            return false;
        }

        if (file.type !== 'video/mp4') {
            swal({
                title: 'Invalid file format !!',
                text: `Only mp4 format is allowed`,
                icon: `info`,
                buttons: `Try Again`
            });
            return false;
        }

        if (videoURL !== '') return false;
        let video = URL.createObjectURL(file);
        setVideo(video);
        setSelectedVideo(file);
    };

    const removeImageHandler = index => {
        const list = [...uploadedImageList];
        list.splice(index, 1);
        setUploadedImageList(list);
    };

    const deleteVideoHandler = () => {
        setVideo("");
        setVideoURL("");
        setSelectedVideo("");
    };

    if (error === '404') return <Alert severity="warning">No Company data found !!</Alert>;

    if (isLoading) {
        return <Splash loading={isLoading} />;
    }

    return (
        <form className='form-structure' onSubmit={insertBrandDetail}>
            <CustomizeTitle text={'Add Brand'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <div className='create-brand__flex'>
                <section className='brand_form'>
                    <div className='company_admin_form'>
                        <div className='company_admin_form_field'>
                            <label>Brand</label>
                            <input placeholder='Audi...' value={brand} onChange={e => setBrand(e.target.value)} required />
                        </div>
                        <div className='company_admin_form_field'>
                            <label>Company</label>
                            <select onChange={(e) => setSelectedCompany(e.target.value)} required>
                                <option value="">select company</option>
                                {company.map((item, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={item?._id}
                                            className='company_list'>
                                            {item?.company_name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className='company_admin_form_field'>
                            <label>Carousel Headings</label>
                            <input placeholder='heading...' className='right-spacing' value={heading} onChange={e => setHeading(e.target.value)} />
                            <AddIcon className='addlist__icon'
                                onClick={() => handleAdd(carousel_headings, heading, setCarouselHeading, setHeading)}
                            />
                        </div>
                        <div className='company_admin_form_field'>
                            <label>Carousel Text</label>
                            <input placeholder='text...' className='right-spacing' value={text} onChange={e => setText(e.target.value)} />
                            <AddIcon className='addlist__icon'
                                onClick={() => handleAdd(carousel_text, text, setCarouselText, setText)}
                            />
                        </div>
                        <div className='company_admin_form_field'>
                            <label>Authentication Feature</label>
                            <select onChange={(e) => setAuthenticationFeature(e.target.value)} required>
                                <option value="">Select Feature</option>
                                <option value={"Label"}>Label</option>
                                <option value={"Batch"}>Batch</option>
                                <option value={"No Feature"}>No Feature</option>
                            </select>
                        </div>

                        <div className='company_admin_form_field'>
                            <label>Re Order Link</label>
                            <input placeholder='re-order link...' value={re_order_link} onChange={e => setReOrderLink(e.target.value)} />
                        </div>

                        <div className='company_admin_form_field'>
                            <label>Product Description</label>
                            <textarea placeholder='description...' value={product_description} onChange={e => setProductDescription(e.target.value)} />
                        </div>

                        <div className='company_admin_form_field'>
                            <label>Video Link</label>
                            <input placeholder='video link...' value={videoURL} onChange={e => setVideoURL(e.target.value)} />
                        </div>

                        {survey_feature && <div className='company_admin_form_field'>
                            <label>Survey Link</label>
                            <input placeholder='survey link...' value={survey_link} onChange={e => setSurveyLink(e.target.value)} />
                        </div>}

                        {email_support && <div className='company_admin_form_field'>
                            <label>Email</label>
                            <input placeholder='email...' value={email_id} onChange={e => setEmailId(e.target.value)} />
                        </div>}

                        {call_support && <div className='company_admin_form_field'>
                            <label>Call No</label>
                            <input placeholder='call no...' value={call_no} onChange={e => setCallNo(e.target.value)} />
                        </div>}

                        {whatsapp_support && <div className='company_admin_form_field'>
                            <label>Whatsapp No</label>
                            <input placeholder='9134984...' value={whatsapp_number} onChange={e => setwhatsappNumber(e.target.value)} />
                        </div>}

                        {instagram && <div className='company_admin_form_field'>
                            <label>Instagram Link</label>
                            <input placeholder='http://instagram...' value={insta_link} onChange={e => setInstaLink(e.target.value)} />
                        </div>}

                        {facebook && <div className='company_admin_form_field'>
                            <label>Facebook Link</label>
                            <input placeholder='http://facebook...' value={fb_link} onChange={e => setFbLink(e.target.value)} />
                        </div>}
                    </div>

                    {/* Uploaded Images */}
                    <div style={{ width: "40%", marginTop: '2%' }}>
                        <div className='upload-btns-group'>
                            <div>
                                <div className="upload-btn-wrapper">
                                    <FileUploadOutlinedIcon
                                        color="primary"
                                        sx={{ fontSize: 30 }}
                                    />
                                    <span>Images</span>
                                    <input type="file" onChange={handleUploadImage} multiple accept='image/*' />
                                </div>
                                <h6 className='subscript'>Max 7 Images Limit</h6>
                            </div>
                            <div>
                                <div className="upload-btn-wrapper" >
                                    <FileUploadOutlinedIcon
                                        color="primary"
                                        sx={{ fontSize: 30 }}
                                    />
                                    <span>Video</span>
                                    <input type="file" onChange={handleUploadVideo} accept='video/*' disabled={videoURL !== ''} />
                                </div>
                                <h6 className='subscript'>Max 50MB video Limit</h6>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button style={{ width: "100%", marginBottom: '5%' }}>Create Brand</button>
                    {/* Submit Button */}

                    {videoURL === '' && video_url !== '' && (
                        <div className='uploaded-video'>
                            <VideoPlayer source={video_url} />
                            <AppButton
                                Icon={CloseIcon}
                                Text={"Delete Video"}
                                Method={deleteVideoHandler}
                            />
                        </div>
                    )}
                    {videoURL !== '' &&
                        <div className='uploaded-video'>
                            <iframe
                                width="100%"
                                height="100%"
                                src={videoURL}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                            <AppButton
                                Icon={CloseIcon}
                                Text={"Delete Video"}
                                Method={deleteVideoHandler}
                            />
                        </div>
                    }
                </section>
                <section className='brand-checkboxes'>
                    <div className='brand-checkbox'>
                        <div className='checkboxes'>
                            <label>Brand Status</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setBrandActiveStatus(event.target.checked)} checked={brand_active_status} />
                                    }
                                    label="Active"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Warranty</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setWarranty(event.target.checked)} checked={warranty} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Request Help</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setRequestHelp(event.target.checked)} checked={request_help} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Survey Feature</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setSurveyFeature(event.target.checked)} checked={survey_feature} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Promo Code</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setPromoCode(event.target.checked)} checked={promo_code} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Referrals</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setReferrals(event.target.checked)} checked={referrals} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Email Support</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setEmailSupport(event.target.checked)} checked={email_support} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Call Support</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setCallSupport(event.target.checked)} checked={call_support} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Whatsapp Support</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setwhatsappSupport(event.target.checked)} checked={whatsapp_support} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Instagram</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setInstagram(event.target.checked)} checked={instagram} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div className='checkboxes'>
                            <label>Facebook</label>
                            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    name='company_status'
                                    control={
                                        <Checkbox onChange={(event) => setFacebook(event.target.checked)} checked={facebook} />
                                    }
                                    label="Available"
                                />
                            </FormGroup>
                        </div>

                        <div style={{ width: '100%' }}>
                            {carousel_headings.length !== 0 &&
                                <div>
                                    <label>Carousel Headings</label>
                                    <div className='chips'>
                                        {carousel_headings?.map((item, index) => {
                                            return (
                                                <p
                                                    key={index}
                                                    onClick={() => handleRemove(carousel_headings, index, setCarouselHeading)}
                                                    className='sub-category-chips selected-chip'
                                                >{item} <CloseIcon /></p>
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                            {carousel_text.length !== 0 &&
                                <div style={{ margin: "15px 0" }}>
                                    <label>Carousel Text</label>
                                    <div className='chips'>
                                        {carousel_text?.map((item, index) => {
                                            return (
                                                <p
                                                    key={index}
                                                    onClick={() => handleRemove(carousel_text, index, setCarouselText)}
                                                    className='sub-category-chips selected-chip'
                                                >{item} <CloseIcon /></p>
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                    <div className={'imageList'}>
                        {uploadedImageList.length !== 0 && uploadedImageList?.map((item, index) => (
                            <div
                                key={index}
                                className='imageList__container'
                                onClick={() => removeImageHandler(index)}
                            >
                                <img
                                    src={item}
                                    className={'imageList__img'}
                                    alt={'imageList__img'}
                                />
                                <div>
                                    <CloseIcon color={"secondary"}
                                        sx={{
                                            fontSize: 15,
                                            width: 20,
                                            height: 20,
                                            borderRadius: 30,
                                            bgcolor: '#000'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </form>
    );
};



export default CreateBrand;
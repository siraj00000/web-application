import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import CustomizeTitle from '../../../../mui_theme/title';
import { updateBrand, updateImagesIntoDB } from '../../../../utils/actions/brand';
// Mui icons
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
// styles
import '../../../auth/auth.css';
import './brand.css';
import '../Admin/admin.css';
import VideoPlayer from '../../../../components/VideoPlayer';
import Splash from '../../../../components/splash';
import { removeStatus, token } from '../../../../utils/actions';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppButton } from '../../../../components/StyledComponent';
import swal from 'sweetalert';

const EditBrand = () => {
    let nav = useNavigate();
    const { data, id } = useLocation().state;
    const [isLoading, setLoading] = useState(false);
    // Field States
    const [heading, setHeading] = useState("");
    const [text, setText] = useState("");
    const [carousel_headings, setCarouselHeading] = useState(data.carousel_headings);
    const [carousel_text, setCarouselText] = useState(data.carousel_text);
    const [product_description, setProductDescription] = useState(data.product_description);
    const [survey_link, setSurveyLink] = useState(data.survey_link);
    const [brand_active_status, setBrandActiveStatus] = useState(data.brand_active_status);
    const [re_order_link, setReOrderLink] = useState(data.re_order_link);
    const [email_support, setEmailSupport] = useState(data.email_support);
    const [email_id, setEmailId] = useState(data.email_id);
    const [call_support, setCallSupport] = useState(data.call_support);
    const [call_no, setCallNo] = useState(data.call_no);
    const [whatsapp_support, setwhatsappSupport] = useState(data.whatsapp_support);
    const [whatsapp_number, setwhatsappNumber] = useState(data.whatsapp_number);
    const [instagram, setInstagram] = useState(data.instagram);
    const [insta_link, setInstaLink] = useState(data.insta_link);
    const [facebook, setFacebook] = useState(data.facebook);
    const [fb_link, setFbLink] = useState(data.fb_link);
    const [uploadedImageList, setUploadedImageList] = useState(data.image_list);
    const [selectedVideo, setSelectedVideo] = useState("");
    const [video_url, setVideo] = useState(data.video_url);
    const [videoURL, setVideoURL] = useState(data.video_url);
    const [__file, setFile] = useState(data.image_list);

    const [error, setError] = useState('');

    const verifyUploads = () => {
        if (__file.length === 0) {
            setError("Images not found!");
            removeStatus(setError);
            return false;
        } else return true;
    };

    const filterFiles = () => {
        let prevFiles = [];
        let newFiles = [];
        for (const key in __file) {
            if (__file[key].public_id !== undefined) {
                const element = __file[key];
                prevFiles.push(element);
            } else {
                const element = __file[key];
                newFiles.push(element);
            }
        }
        const files = { prevFiles, newFiles };
        return files;
    };

    const updateBrandDetail = async (e) => {
        e.preventDefault();

        //TODO: Verify images and video uploads
        const verify = verifyUploads();
        if (verify) {
            try {
                setLoading(true);
                let emptyVideo = videoURL === "" && selectedVideo === "";
                let reqBody = {
                    brand_active_status, carousel_headings, carousel_text, product_description,
                    survey_link, re_order_link, email_support, email_id, call_support, call_no, whatsapp_support,
                    whatsapp_number, instagram, insta_link, facebook, fb_link, videoURL, emptyVideo
                };

                //? Object Instance
                const updateForm = new FormData();

                //? Filter out new system upload and previous cloudinary images
                const files = filterFiles();

                // Todo: Uploads new uploaded images from system
                if (files.newFiles.length !== 0) {
                    for (let index = 0; index < files.newFiles.length; index++) {
                        updateForm.append("image", files.newFiles[index]);
                    }
                } else {
                    // Todo: If no new uploads found then empty array will be send
                    updateForm.append("image", []);
                }
                /**
                 * Todo: Send previous cloudinary images
                 * ? Help us to save same data no need to save previously saved images in cloudinary
                 * */
                reqBody["prevImages"] = files.prevFiles;

                updateForm.append("video", selectedVideo);
                updateForm.append("reqBody", JSON.stringify(reqBody));

                updateBrand(id, token, updateForm)
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
        let images = [...uploadedImageList];
        let imageDetail = [...__file];
        for (let i = 0; i < event.target.files.length; i++) {
            let file = event.target.files[i];
            images.push(URL.createObjectURL(file));
            imageDetail.push(file);
        }
        setFile(imageDetail);
        setUploadedImageList(images);
    };

    const handleUploadVideo = event => {
        if (videoURL !== '') return false;
        let video = { url: URL.createObjectURL(event.target.files[0]), name: event.target.files[0].name };
        setVideo(video);
        setSelectedVideo(event.target.files[0]);
    };

    const removeImageHandler = (public_id, index) => {
        try {
            const list = [...uploadedImageList];
            list.splice(index, 1);
            setUploadedImageList(list);

            // Deletes image from cloudinary
            // Updates image list in brand document
            let reqBody = { public_id };
            updateImagesIntoDB(id, token, reqBody)
                .then(res => {
                    swal({
                        title: "Success!",
                        text: res?.data?.msg,
                        icon: "success",
                        button: "Okay!",
                    });
                })
                .catch(error => {
                    setError(error?.response.data.error);
                    removeStatus(setError);
                });
        } catch (error) {
            setError(error.message);
            removeStatus(setError);
        }
    };

    const deleteVideoHandler = () => {
        setVideo("");
        setVideoURL("");
        setSelectedVideo("");
    };

    if (isLoading) {
        return <Splash loading={isLoading} />;
    }

    let TYPE_VIDEO_URL = typeof videoURL === 'object' && Object.keys(videoURL).length === 0 ? "" : videoURL;

    return (
        <form className='form-structure' onSubmit={updateBrandDetail}>
            <CustomizeTitle text={'Update Brand'} />
            {error !== '' && <Alert severity="error">{error}</Alert>}

            <div className='create-brand__flex full-width'>
                <section className='brand_form'>
                    <div className='company_admin_form'>
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
                            <label>Re Order Link</label>
                            <input placeholder='re-order link...' value={re_order_link} onChange={e => setReOrderLink(e.target.value)} />
                        </div>

                        <div className='company_admin_form_field'>
                            <label>Video Link</label>
                            <input placeholder='video link...' value={videoURL.url || TYPE_VIDEO_URL} onChange={e => setVideoURL(e.target.value)} />
                        </div>

                        <div className='company_admin_form_field'>
                            <label>Product Description</label>
                            <textarea placeholder='description...' value={product_description} onChange={e => setProductDescription(e.target.value)} />
                        </div>

                        <div className='company_admin_form_field'>
                            <label>Survey Link</label>
                            <input placeholder='survey link...' value={survey_link} onChange={e => setSurveyLink(e.target.value)} />
                        </div>

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
                    <button style={{ width: "100%", margin: '5% 0' }}>Update Brand</button>
                    {/* Submit Button */}
                    {TYPE_VIDEO_URL !== '' && (video_url !== '' || videoURL !== '') &&
                        (
                            video_url.name !== undefined ?
                                <div className='uploaded-video'>
                                    <VideoPlayer source={video_url?.url || videoURL} />
                                    <AppButton
                                        Icon={CloseIcon}
                                        Text={"Delete Video1"}
                                        Method={deleteVideoHandler}
                                    />
                                </div>
                                :
                                <div className='uploaded-video'>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={videoURL?.url || videoURL || video_url.url}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    ></iframe>
                                    <AppButton
                                        Icon={CloseIcon}
                                        Text={"Delete Video2"}
                                        Method={deleteVideoHandler}
                                    />
                                </div>
                        )
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
                        {uploadedImageList?.length !== 0 && uploadedImageList?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className='imageList__container'
                                    onClick={() => removeImageHandler(item.public_id, index)}
                                >
                                    <img
                                        src={item.url || item}
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
                            );
                        })}
                    </div>
                </section>
            </div>
        </form>
    );
};

export default EditBrand;
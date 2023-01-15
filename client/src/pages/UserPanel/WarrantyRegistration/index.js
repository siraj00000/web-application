import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WARRANTY_FORM_GRID } from '../../../utils/data';
import { actionPost } from '../../../utils/userActions';
import swal from 'sweetalert';
import '../form.css';


const WarrantyRegistration = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const genDS1 = () => {
    let split = pathname.split("/");
    return "/" + split[1] + "/" + split[2];
  };
  let ds1 = genDS1();

  const [values, setValues] = useState({
    ds1: ds1,
    warranty_activated: true,
    purchase_date: "",
    store_name_and_address: "",
    store_pin_code: "",
    warranty_duration: "",
    invoice_number: "",
    invoice_image: "",
    pincode: "",
    address1: "",
    address2: ""
  });
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleUploadImage = (e) => {
    setValues({ ...values, invoice_image: e.target.files[0] });
  };

  const handleWarrantySubmittion = async (e) => {
    e.preventDefault();
    try {
      const warrantyFormData = new FormData();
      warrantyFormData.append('image', values.invoice_image);
      values['invoice_image'] = undefined;  
      warrantyFormData.append('req_body', JSON.stringify(values));

      const response = await actionPost("/api/insert-warranty", warrantyFormData);
      swal("Success", response.data.msg, "success")
        .then(() => navigate(-1, { replace: true }));
    } catch (error) {
      swal("error", error, "error");
    }
  };
  return (
    <main>
      <form onSubmit={handleWarrantySubmittion} className='--form-layout'>
        <h1>Register Warranty</h1>
        {WARRANTY_FORM_GRID.map((input, index) => (
          <div key={index}>
            <label>{input.label}</label>
            <input
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          </div>
        ))}
        <div>
          <label>Invoice Image</label>
          <input
            name="invoice_image"
            type="file"
            onChange={handleUploadImage}
          />
        </div>
        <button>Submit</button>
      </form>
    </main>
  );
};

export default WarrantyRegistration;
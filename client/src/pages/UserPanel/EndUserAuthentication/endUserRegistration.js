import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { actionPost } from '../../../utils/userActions';
import swal from 'sweetalert';
import '../form.css';

const EndUserRegistration = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "", phone: "" });
  const setSignUpCredentials = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const EndUserRegistrationHandler = async (e) => {
    e.preventDefault();
    try {
      let URL = `/api/reqister-enduser`;
      const response = await actionPost(URL, credentials);
      let info = response?.data?.data;
      navigate("/user/verification", { state: info, replace: true });
    } catch (error) {
      swal("Error!", error, "error");
    }
    setCredentials({ email: "", password: "", phone: "" });
  };
  return (
    <main>
      <form onSubmit={EndUserRegistrationHandler} className='--form-layout -w-half'>
        <h1>Sign Up</h1>
        <div className='-input-full'>
          <label>Email</label>
          <input
            name='email'
            type={'email'}
            placeholder='mark@example.com'
            value={credentials.email}
            onChange={setSignUpCredentials}
          />
        </div>
        <div className='-input-full'>
          <label>Password</label>
          <input
            name='password'
            type={'password'}
            placeholder='mark!123'
            value={credentials.password}
            onChange={setSignUpCredentials}
          />
        </div>
        <div className='-input-full'>
          <label>phone</label>
          <input
            name='phone'
            type={'tel'}
            placeholder='09239112'
            value={credentials.phone}
            onChange={setSignUpCredentials}
          />
        </div>
        <button>Sign Up</button>
        <NavLink to="/user/login">Already have an account? Login</NavLink>
      </form>
    </main>
  );
};

export default EndUserRegistration;
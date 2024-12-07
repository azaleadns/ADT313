import { useState, useRef, useCallback } from 'react';
import './Register.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRole] = useState('');
  const [hasDirtyFields, setHasDirtyFields] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const contactNoInputRef = useRef();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    if (!email || !password || !firstName || !lastName || !contactNo || !role) {
      setErrorText('Please fill out all required fields.');
      setHasDirtyFields(true);
      if (!email) emailInputRef.current.focus();
      else if (!password) passwordInputRef.current.focus();
      else if (!firstName) firstNameInputRef.current.focus();
      else if (!lastName) lastNameInputRef.current.focus();
      else if (!contactNo) contactNoInputRef.current.focus();
      else document.querySelector('select').focus();
      return false;
    }
    if (!validateEmail(email)) {
      setErrorText('Invalid email format.');
      emailInputRef.current.focus();
      return false;
    }
    return true;
  };

  const handleInputChange = (event, fieldType) => {
    setHasDirtyFields(true);
    const value = event.target.value;
    switch (fieldType) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      case 'middleName':
        setMiddleName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'contactNo':
        setContactNo(value);
        break;
      case 'role':
        setRole(value);
        break;
      default:
        break;
    }
  };

  const checkExistingEmail = async (email) => {
    try {
      const response = await axios.get(`/admin/check-email?email=${email}`);
      return response.data.exists; 
    } catch (error) {
      console.error('Error checking email:', error);
      return false; 
    }
  };

  const handleRegistration = async () => {
    if (!validateFields()) return;

    setLoadingStatus('loading');
    setErrorText(''); 

  
    const emailExists = await checkExistingEmail(email);
    if (emailExists) {
      setErrorText('Email already exists. Please log in.');
      setTimeout(() => {
        navigate('/'); // Redirect to login page
      }, 2000);
      setLoadingStatus('idle');
      return;
    }

    const userData = { email, password, firstName, middleName, lastName, contactNo, role };

    try {
      const response = await axios.post('/admin/register', userData, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      console.log('Registration successful:', response);
      navigate('/'); // Navigate to the dashboard
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorText(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoadingStatus('idle');
    }
  };

  return (
    <div className="Register">
      <div className="main-container">
      <h2 className='login-title'>F I L M S C A P E</h2>
        {errorText && <div className="error-message">{errorText}</div>}
        <form>
          <div className="form-container">
          <h3>REGISTER</h3>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="text"
                ref={emailInputRef}
                value={email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              {hasDirtyFields && email === '' && <span className="errors">This field is required</span>}
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                ref={passwordInputRef}
                value={password}
                onChange={(e) => handleInputChange(e, 'password')}
              />
              {hasDirtyFields && password === '' && <span className="errors">This field is required</span>}
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                ref={firstNameInputRef}
                value={firstName}
                onChange={(e) => handleInputChange(e, 'firstName')}
              />
              {hasDirtyFields && firstName === '' && <span className="errors">This field is required</span>}
            </div>
            <div className="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => handleInputChange(e, 'middleName')}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                ref={lastNameInputRef}
                value={lastName}
                onChange={(e) => handleInputChange(e, 'lastName')}
              />
              {hasDirtyFields && lastName === '' && <span className="errors">This field is required</span>}
            </div>
            <div className="form-group">
              <label>Contact No:</label>
              <input
                type="text"
                ref={contactNoInputRef}
                value={contactNo}
                onChange={(e) => handleInputChange(e, 'contactNo')}
              />
              {hasDirtyFields && contactNo === '' && <span className="errors">This field is required</span>}
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select value={role} onChange={(e) => handleInputChange(e, 'role')}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {hasDirtyFields && role === '' && <span className="errors">This field is required</span>}
            </div>
            <div className="show-password" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? 'Hide' : 'Show'} Password
            </div>
            <div className="submit-container">
              <button
                type="button"
                disabled={loadingStatus === 'loading'}
                onClick={handleRegistration}
              >
                {loadingStatus === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>
            <div className="login-container">
              <Link to="/">
                <small style={{ color: '#20c997' }}>Already have an account? Login</small>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

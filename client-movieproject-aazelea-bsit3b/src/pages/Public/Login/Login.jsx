import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasTouchedFields, setHasTouchedFields] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const debouncedInput = useDebounce({ email, password }, 2000);
  const [isDebounced, setIsDebounced] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('idle');

  const navigate = useNavigate();

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prevState) => !prevState);
  }, []);

  const handleInputChange = (event, field) => {
    setIsDebounced(false);
    setHasTouchedFields(true);

    if (field === 'email') {
      setEmail(event.target.value);
    } else if (field === 'password') {
      setPassword(event.target.value);
    }
  };

  const submitLogin = async () => {
    const credentials = { email, password };
    setLoadingStatus('loading');
    console.log(credentials);

    try {
      const response = await axios.post('/user/login', credentials, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      localStorage.setItem('accessToken', response.data.access_token);
      navigate('/home');
      setLoadingStatus('idle');
    } catch (error) {
      console.error(error);
      setLoadingStatus('idle');
    }
  };

  useEffect(() => {
    setIsDebounced(true);
  }, [debouncedInput]);

  const handleLoginClick = () => {
    if (loadingStatus === 'loading') return;

    if (email && password) {
      setLoadingStatus('loading');
      setTimeout(() => {
        submitLogin();
      }, 2000); 
    } else {
      setHasTouchedFields(true);
      if (!email) emailInputRef.current.focus();
      if (!password) passwordInputRef.current.focus();
    }
  };

  return (
    <div className='Login'>
      <div className='main-container'>
        <h3>Sign In</h3>
        <form>
          <div className='form-container'>
            <div>
              <div className='form-group'>
                <label>Email:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailInputRef}
                  value={email}
                  onChange={(e) => handleInputChange(e, 'email')}
                />
              </div>
              {isDebounced && hasTouchedFields && !email && (
                <span className='errors'>This field is required</span>
              )}
            </div>

            <div>
              <div className='form-group'>
                <label>Password:</label>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name='password'
                  ref={passwordInputRef}
                  value={password}
                  onChange={(e) => handleInputChange(e, 'password')}
                />
              </div>
              {isDebounced && hasTouchedFields && !password && (
                <span className='errors'>This field is required</span>
              )}
            </div>

            <div className='show-password' onClick={togglePasswordVisibility}>
              {isPasswordVisible ? 'Hide' : 'Show'} Password
            </div>

            <div className='submit-container'>
              <button
                className='btn-primary'
                type='button'
                disabled={loadingStatus === 'loading'}
                onClick={handleLoginClick}
              >
                {loadingStatus === 'idle' ? 'Login' : 'Please wait...'}
              </button>
            </div>

            <div className='register-container'>
              <small>Don't have an account? </small>
              <a href='/register'>
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

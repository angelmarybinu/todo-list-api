import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (values.username && values.password && values.first_name && values.last_name) {
      try {
        const response = await fetch('https://jelan.pythonanywhere.com/api/user/signup', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          navigate('/');
        } else {
          const data = await response.json();
          setError(data.message || 'Sign up failed');
        }
      } catch (error) {
        setError('Sign up failed');
      }
    } else {
      setError('Please provide all required fields');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={values.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={values.last_name}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;

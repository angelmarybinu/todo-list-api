import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    username: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (values.username && values.password) {
      try {
        const response = await fetch('https://jelan.pythonanywhere.com/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('loggedInUser', data.username);
          navigate('/todo'); // Redirect to the todo page
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      }
    } else {
      alert('Fill complete form');
    }
  };

  return (
    <div className='container'>
      <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <button className="btn" type="submit">Sign in</button>
        <span>Don't have an account? <Link to="/signup">REGISTER</Link></span>
      </form>
    </div>
  );
};

export default Login;

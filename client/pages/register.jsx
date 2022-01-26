import { useState } from 'react';
import styles from '../public/static/css/register.module.css';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';

const Register = () => {
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register',
    });

    const handleChange = (name) => (e) => {
        setState({
            ...state,
            [name]: e.target.value,
            error: '',
            success: '',
            buttonText: 'Register',
        });
    };

    const { name, email, password, error, success, buttonText } = state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Registering' });
        const response = await axios
            .post(`${process.env.NEXT_PUBLIC_API}/register`, {
                name,
                email,
                password,
            })
            .then((res) => {
                setState({
                    ...state,
                    name: '',
                    email: '',
                    password: '',
                    buttonText: 'Submitted',
                    success: res.data.message,
                });
            })
            .catch((err) => {
                setState({
                    ...state,
                    buttonText: 'Register',
                    error: err.response.data.error,
                });
            });
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className={`${styles.form_group} form-group`}>
                <input
                    type="text"
                    value={name}
                    onChange={handleChange('name')}
                    className="form-control"
                    placeholder="Type your name"
                />
            </div>
            <div className={`${styles.form_group} form-group`}>
                <input
                    type="email"
                    value={email}
                    onChange={handleChange('email')}
                    className="form-control"
                    placeholder="Type your email"
                    required
                />
            </div>
            <div className={`${styles.form_group} form-group`}>
                <input
                    type="password"
                    value={password}
                    onChange={handleChange('password')}
                    className="form-control"
                    placeholder="Type your password"
                    required
                />
            </div>
            <div className={`${styles.form_group} form-group`}>
                <button className="btn btn-outline-warning">
                    {buttonText}
                </button>
            </div>
        </form>
    );
    return (
        <>
            <div className="col-md-6 offset-3">
                <h1>Register</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {registerForm()}
            </div>
        </>
    );
};

export default Register;

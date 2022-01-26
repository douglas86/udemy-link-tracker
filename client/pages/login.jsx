import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styles from '../public/static/css/register.module.css';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {
    const [state, setState] = useState({
        email: 'douglasmaxton@gmail.com',
        password: '123456',
        error: '',
        success: '',
        buttonText: 'Login',
    });

    const handleChange = (name) => (e) => {
        setState({
            ...state,
            [name]: e.target.value,
            error: '',
            success: '',
            buttonText: 'Login',
        });
    };

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);

    const { email, password, error, success, buttonText } = state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Logging in' });
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/login`,
                {
                    email,
                    password,
                }
            );
            // console.log('res', response); // data > token / user
            authenticate(response, () =>
                isAuth() && isAuth().role === 'admin'
                    ? Router.push('/admin')
                    : Router.push('/user')
            );
        } catch (err) {
            setState({
                ...state,
                buttonText: 'Login',
                error: err.response.data.error,
            });
        }
    };

    const LoginForm = () => (
        <form onSubmit={handleSubmit}>
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
                <h1>Login</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {LoginForm()}
            </div>
        </>
    );
};

export default Login;

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
        try {
            const response = await axios
                .post(`http://localhost:8000/api/register`, {
                    name,
                    email,
                    password,
                })
                .then((res) => {
                    console.log(res);
                    setState({
                        ...state,
                        name: '',
                        email: '',
                        password: '',
                        buttonText: 'Submitted',
                        success: res.data.message,
                    });
                });
        } catch (err) {
            console.log(err);
            setState({
                ...state,
                buttonText: 'Register',
                error: err.res.data.error,
            });
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setState({ ...state, buttonText: 'Registering' });
    //     console.table({ name, email, password });

    //         })
    //         .catch((err) => {

    //         });
    // };

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
                />
            </div>
            <div className={`${styles.form_group} form-group`}>
                <input
                    type="password"
                    value={password}
                    onChange={handleChange('password')}
                    className="form-control"
                    placeholder="Type your password"
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

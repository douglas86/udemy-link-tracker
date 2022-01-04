import { useState } from 'react';
import styles from '../public/static/css/register.module.css';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.table({ name, email, password });
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
                {registerForm()}
                <hr />
                {JSON.stringify(state)}
            </div>
        </>
    );
};

export default Register;

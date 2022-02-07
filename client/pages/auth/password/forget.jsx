import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const ForgetPassword = () => {
    const [state, setState] = useState({
        name: '',
        buttonText: 'Forget Password',
        success: '',
        error: '',
    });

    const { name, buttonText, success, error } = state;

    const handleChange = (e) => {
        setState({ ...state, email: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('post email to ', email);
    };

    const passwordForgetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="for-group">
                <input
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    value={email}
                    placeholder="Type your email"
                    required
                />
            </div>
            <button className="btn btn-outline-warning">{buttonText}</button>
        </form>
    );

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <h1>Forget Password</h1>
                <br />
                {passwordForgetForm()}
            </div>
        </div>
    );
};

export default ForgetPassword;

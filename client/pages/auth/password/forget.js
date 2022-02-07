import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const ForgetPassword = () => {
    const [state, setState] = useState({
        email: '',
        buttonText: 'Forget Password',
        success: '',
        error: '',
    });

    const { email, buttonText, success, error } = state;

    const handleChange = (e) => {
        setState({ ...state, email: e.target.value, success: '', error: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('post email to ', email);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API}/forget-password`,
                { email }
            );
            // console.log('res', res);
            setState({
                ...state,
                email: '',
                buttonText: 'Done',
                success: response.data.message,
            });
        } catch (error) {
            console.log('Forget password', error);
            setState({
                ...state,
                buttonText: 'Forget Password',
                error: error.response.data.error,
            });
        }
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
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {passwordForgetForm()}
            </div>
        </div>
    );
};

export default ForgetPassword;

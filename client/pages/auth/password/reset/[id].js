import { useState, useEffect } from 'react';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import {
    showSuccessMessage,
    showErrorMessage,
} from '../../../../helpers/alerts';

const ResetPassword = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password',
        success: '',
        error: '',
    });

    const { name, token, newPassword, buttonText, success, error } = state;

    useEffect(() => {
        console.log(router);
        const decoded = jwt.decode(router.query.id);
        if (decoded) {
            setState({ ...state, name: decoded.name, token: router.query.id });
        }
    }, [router]);

    const handleChange = (e) => {
        setState({
            ...state,
            newPassword: e.target.value,
            success: '',
            error: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Sending' });
        // console.log('post email to ', email);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API}/reset-password`,
                { resetPasswordLink: token, newPassword }
            );
            // console.log('res', res);
            setState({
                ...state,
                email: '',
                buttonText: 'Done',
                success: response.data.message,
            });
        } catch (error) {
            console.log('Reset password', error);
            setState({
                ...state,
                buttonText: 'Forget Password',
                error: error.response.data.error,
            });
        }
    };

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="for-group">
                <input
                    type="password"
                    className="form-control"
                    onChange={handleChange}
                    value={newPassword}
                    placeholder="Type new Password"
                    required
                />
            </div>
            <button className="btn btn-outline-warning">{buttonText}</button>
        </form>
    );

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <h1>Hi {name}, Ready to reset password</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {passwordResetForm()}
            </div>
        </div>
    );
};

export default withRouter(ResetPassword);

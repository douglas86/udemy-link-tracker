import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { withRouter } from 'next/router';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const ActivateAccount = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        buttonText: 'Activate Account',
        success: '',
        error: '',
    });
    const { name, token, buttonText, success, error } = state;

    useEffect(() => {
        let token = router.query.id;
        if (token) {
            let { name } = jwt.decode(token);
            setState({ ...state, name, token });
        }
    }, [router]);

    const clickSubmit = async (e) => {
        e.preventDefault();
        console.log('activate account');
        setState({ ...state, buttonText: 'Activating' });
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API}/register/activate`,
                { token }
            );
            console.log('account activate response', response);
            setState({
                ...state,
                name: '',
                token: '',
                buttonText: 'Activated',
                success: response.data.message,
            });
        } catch (error) {
            console.log('error', error);
            setState({
                ...state,
                buttonText: 'Activate Account',
                // error: error.response.data.error,
            });
        }
    };

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <h1>G'day {name}, Ready to activate your account?</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                <button
                    className="btn btn-outline-warning btn-block"
                    onClick={clickSubmit}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default withRouter(ActivateAccount);

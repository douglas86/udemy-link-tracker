import axios from 'axios';
import { getCookie } from '../../helpers/auth';

const User = ({ user }) => {
    return (
        <>
            <h1>Hello User</h1>
            {JSON.stringify(user)}
        </>
    );
};

User.getInitialProps = async (context) => {
    const token = getCookie('token', context.req);

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/user`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                    contentType: 'application/json',
                },
            }
        );
        return {
            user: response.data,
        };
    } catch (error) {
        if (error.response.status === 401) {
            return { user: 'no user' };
        }
    }
};

export default User;

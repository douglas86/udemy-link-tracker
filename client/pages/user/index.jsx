import axios from 'axios';

const User = ({ todos }) => {
    return (
        <>
            <h1>Hello User</h1>
            {JSON.stringify(todos)}
        </>
    );
};

User.getInitialProps = async () => {
    const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos`
    );

    return {
        todos: response.data,
    };
};

export default User;

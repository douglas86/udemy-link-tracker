import withAdmin from '../withAdmin';

const Admin = ({ user }) => {
    return (
        <>
            <h1>Admin page</h1>
            {JSON.stringify(user)}
        </>
    );
};

export default withAdmin(Admin);

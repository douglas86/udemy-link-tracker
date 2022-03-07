import axios from 'axios';
import { getCookie } from '../../helpers/auth';
import withUser from '../withUser';

const User = ({ user, token }) => {
  return (
    <>
      <h1>Hello User</h1>
      {JSON.stringify(user)}
    </>
  );
};

export default withUser(User);

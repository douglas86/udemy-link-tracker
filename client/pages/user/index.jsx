import axios from 'axios';
import { getCookie } from '../../helpers/auth';
import withUser from '../withUser';

const User = ({ user, userLinks }) => {
  return <>{JSON.stringify(userLinks)}</>;
};

export default withUser(User);

// imports
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { getCookie, isAuth } from '../../../helpers/auth';

const Create = ({ token }) => {
  // state
  const [state, setState] = useState({
    title: '',
    url: '',
    categories: [],
    loadedCategories: [],
    success: '',
    error: '',
    type: '',
    medium: '',
  });
  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/categories`
    );
    setState({ ...state, loadedCategories: response.data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ title, url, categories, type, medium });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/link`,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        title: '',
        url: '',
        success: 'Link is created',
        error: '',
        loadedCategories: [],
        categories: [],
        type: '',
        medium: '',
      });
    } catch (err) {
      console.log('Link submit error', err);
      setState({ ...state, error: err.response.data.error });
    }
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, error: '', success: '' });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, error: '', success: '' });
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: '', error: '' });
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: '', error: '' });
  };

  const showMedium = () => (
    <>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            checked={medium === 'video'}
            value="video"
            className="from-check-input"
            name="medium"
          />
          {'  '}
          Video
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            checked={medium === 'book'}
            value="book"
            className="from-check-input"
            name="medium"
          />
          {'  '}Book
        </label>
      </div>
    </>
  );

  const showTypes = () => (
    <>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            checked={type === 'free'}
            value="free"
            className="from-check-input"
            name="type"
          />
          {'  '}
          Free
        </label>
      </div>
      <div className="form-check ml-3">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            checked={type === 'paid'}
            value="paid"
            className="from-check-input"
            name="type"
          />
          {'  '}Paid
        </label>
      </div>
    </>
  );

  const handleToggle = (c) => () => {
    // return the first index -1
    const clickedCatagory = categories.indexOf(c);
    const all = [...categories];
    if (clickedCatagory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCatagory, 1);
    }
    console.log('all >> categories', all);
    setState({ ...state, categories: all, success: '', error: '' });
  };

  // show categories checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  // link create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          type="text"
          className="form-control"
          onChange={handleURLChange}
          value={url}
        />
      </div>
      <button
        disabled={!token}
        className="btn btn-outline-warning"
        type="submit"
      >
        {isAuth() || token ? 'Post' : 'Login to post'}
      </button>
    </form>
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Submit Link/URL</h1>
        <br />
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted ml-4">Categories</label>
            <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group">
            <label className="text-muted ml-4">Type</label>
            {showTypes()}
          </div>
          <div className="form-group">
            <label className="text-muted ml-4">Medium</label>
            {showMedium()}
          </div>
        </div>
        <div className="col-md-8">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {submitLinkForm()}
        </div>
      </div>
    </div>
  );
};

Create.getInitialProps = ({ req }) => {
  const token = getCookie('token', req);
  return { token };
};

export default Create;

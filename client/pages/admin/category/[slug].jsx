import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Update = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: '',
    success: '',
    buttonText: 'Update',
    imagePreview: oldCategory.image.url,
    image: '',
  });
  const [content, setContent] = useState(oldCategory.content);

  const [imageUploadButtonName, setImageUploadButtonName] =
    useState('Update image');

  const { name, error, success, buttonText, imagePreview, image } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: '', error: '' });
  };

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButtonName(event.target.files[0].name);
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          'JPEG',
          100,
          0,
          (uri) => {
            setState({ ...state, image: uri, success: '', error: '' });
          },
          'base64',
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Updating' });
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('category update response', response);
      setImageUploadButtonName('Update image');
      setContent('');
      setState({
        ...state,
        name: response.data.name,
        buttonText: 'Updated',
        imageUploadText: 'Update image',
        imagePreview: response.data.image.url,
        success: `${response.data.name} is update`,
      });
      setContent(response.data.content);
    } catch (error) {
      console.log('Category create error', error);
      setState({
        ...state,
        name: '',
        buttonText: 'Create',
        error: error.response.data.error,
      });
    }
  };

  const updateCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange('name')}
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="Write something..."
          theme="bubble"
          className="pb-5 mb-3"
          style={{ border: '1px solid #666' }}
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}{' '}
          <span>
            <img src={imagePreview} alt="image" height="20" />
          </span>
          <input
            onChange={handleImage}
            type="file"
            accept="image/*"
            className="form-control"
            hidden
          />
        </label>
      </div>
      <div>
        <button
          style={{ marginTop: '20px' }}
          className="btn btn-outline-warning"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <h1>Update category</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {updateCategoryForm()}
      </div>
    </div>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API}/category/${query.slug}`
  );
  return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);

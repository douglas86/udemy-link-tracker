import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    content: "",
    error: "",
    success: "",
    buttonText: "Create",
    image: "",
  });

  const [imageUploadButtonName, setImageUploadButtonName] =
    useState("Upload image");

  const { name, content, error, success, buttonText, imageUploadText, image } =
    state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
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
          "JPEG",
          100,
          0,
          (uri) => {
            setState({ ...state, image: uri, success: "", error: "" });
          },
          "base64",
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
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("category create response", response);
      setImageUploadButtonName("Upload image");
      setState({
        ...state,
        name: "",
        content: "",
        buttonText: "Created",
        imageUploadText: "Upload image",
        success: `${response.data.name} is created`,
      });
    } catch (error) {
      console.log("Category create error", error);
      setState({
        ...state,
        name: "",
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <textarea
          onChange={handleChange("content")}
          value={content}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
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
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <h1>Create category</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {createCategoryForm()}
      </div>
    </div>
  );
};

export default withAdmin(Create);

// imports
import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Create = () => {
  // state
  const [state, setState] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    success: "",
    error: "",
    type: "",
    medium: "",
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
    console.log("e", e);
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, error: "", success: "" });
  };

  // link create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted" htmlFor="">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted" htmlFor="">
          URL
        </label>
        <input
          type="text"
          className="form-control"
          onChange={handleURLChange}
          value={url}
        />
      </div>
      <button className="btn btn-outline-warning" type="submit">
        Submit
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
        <div className="col-md-4">xxx</div>
        <div className="col-md-8">{submitLinkForm()}</div>
      </div>
    </div>
  );
};

export default Create;

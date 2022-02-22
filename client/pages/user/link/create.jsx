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

  const handleToggle = (c) => () => {
    // return the first index -1
    const clickedCatagory = categories.indexOf(c);
    const all = [...categories];
    if (clickedCatagory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCatagory, 1);
    }
    console.log("all >> categories", all);
    setState({ ...state, categories: all, success: "", error: "" });
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
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted ml-4">Categories</label>
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
        </div>
        <div className="col-md-8">{submitLinkForm()}</div>
      </div>
      {JSON.stringify(categories)}
    </div>
  );
};

export default Create;

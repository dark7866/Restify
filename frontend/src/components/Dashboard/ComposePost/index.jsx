import "./style.css";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";

const ComposePost = ({ setToast }) => {
  const { authToken } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setLogoErrorMessage("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [logoErrorMessage, setLogoErrorMessage] = useState("");
  const { register, handleSubmit } = useForm();

  const addRestaurantBlog = async (data) => {
    var formData = new FormData();
    if (data.picture && data.picture.length !== 0) {
      formData.append("picture", data.picture[0]);
    }
    formData.append("name", data.name);
    formData.append("content", data.content);

    await fetch("http://127.0.0.1:8000/restaurant/blog/add/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          handleClose();
          setToast();
        });
      } else {
        response.json().then((data) => {
          if ("picture" in data) {
            setLogoErrorMessage(data["picture"]);
          }
        });
      }
    });
  };

  return (
    <>
      <div className="card-body">
        <a
          style={{
            color: "black",
            textDecoration: "none",
            cursor: "pointer",
            textAlign: "left",
            borderRadius: "20px",
          }}
          onClick={handleShow}
          className="form-control content"
        >
          Compose a blog post
        </a>
      </div>
      <Modal dialogClassName="modalWidth" show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit(addRestaurantBlog)}>
          <Modal.Header closeButton>
            <Modal.Title> Add New Blog Post </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <figure className="mb-4">
              <img
                className="img-fluid rounded"
                src="https://dummyimage.com/900x400/ced4da/6c757d.jpg"
                alt="..."
              />
            </figure>
            {logoErrorMessage !== "" && (
              <p className="error-message">{logoErrorMessage}</p>
            )}
            <div className="mb-4">
              <label forhtml="formFile" className="form-label">
                Image
              </label>
              <input
                {...register("picture")}
                className="form-control"
                type="file"
                id="formFile"
              />
            </div>
            <div className="mb-4 form-group">
              <label forhtml="exampleFormControlInput1">Title</label>
              <input
                required
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                {...register("name")}
              />
            </div>
            <div className="mb-4 form-group">
              <label forhtml="exampleFormControlTextarea1">Content</label>
              <textarea
                required
                style={{ height: "620px" }}
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                {...register("content")}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ComposePost;

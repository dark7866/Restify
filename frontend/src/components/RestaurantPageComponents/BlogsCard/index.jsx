import ReactPaginate from "react-paginate";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { HiOutlinePlus, HiOutlinePencil } from "react-icons/hi";
import "./style.css";

const RestaurantBlogsCard = ({ ownerStatus, restaurantId }) => {
  const { authToken } = useContext(AuthContext);
  const [restaurantBlogs, setRestaurantBlogs] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [showItems, setShowItems] = useState({});
  const [showDelete, setShowDelete] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [logoErrorMessage, setLogoErrorMessage] = useState("");
  const handleClose = () => {
    setLogoErrorMessage("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const { register, reset, handleSubmit } = useForm();

  const handleCloseItems = (index) => {
    setLogoErrorMessage("");
    setShowItems((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };
  const handleShowItems = (index) =>
    setShowItems((prevState) => ({
      ...prevState,
      [index]: true,
    }));
  const handleCloseDelete = (index) =>
    setShowDelete((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  const handleShowDelete = (index) =>
    setShowDelete((prevState) => ({
      ...prevState,
      [index]: true,
    }));

  const formatDate = (dateObj) => {
    let month = dateObj.toLocaleString("default", { month: "long" });
    let date = dateObj.getDate();
    let year = dateObj.getFullYear();

    return `${month} ${date}, ${year}`;
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit blog post
    </Tooltip>
  );

  const renderTooltipAdd = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add blog post
    </Tooltip>
  );

  const getRestaurantBlogs = async (page) => {
    return await fetch(
      `http://127.0.0.1:8000/restaurant/blogs/${restaurantId}/?page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        //
      }
    });
  };
  const handlePageClick = (data) => {
    let currentPage = data.selected + 1;
    setActivePage(currentPage);
    getRestaurantBlogs(currentPage).then((data) => {
      setPageCount(Math.ceil(data["count"] / 3));
      setRestaurantBlogs(data["results"]);
    });
  };

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
          getRestaurantBlogs(1).then((data) => {
            setActivePage(1);
            setPageCount(Math.ceil(data["count"] / 3));
            setRestaurantBlogs(data["results"]);
          });
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

  const editBlogItem = async (data, index) => {
    var formData = new FormData();
    formData.append("name", data.name);
    formData.append("content", data.content);
    if (data.picture && data.picture.length === 0) {
      formData.append("picture", "");
    } else if (
      typeof data.picture !== "string" &&
      data.picture &&
      data.picture.length !== 0
    ) {
      formData.append("picture", data.picture[0]);
    }

    await fetch(`http://127.0.0.1:8000/restaurant/blog/edit/${index}/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          getRestaurantBlogs(activePage).then((data) => {
            setRestaurantBlogs(data["results"]);
            handleCloseItems(index);
          });
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

  const onClickDelete = (index) => {
    handleCloseItems(index);
    handleShowDelete(index);
  };

  const deleteBlogItem = async (index) => {
    await fetch(`http://127.0.0.1:8000/restaurant/blog/edit/${index}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (restaurantBlogs.length === 1) {
            getRestaurantBlogs(activePage - 1 === 0 ? 1 : activePage - 1).then(
              (data) => {
                setActivePage(activePage - 1 == 0 ? 1 : activePage - 1);
                setPageCount(Math.ceil(data["count"] / 3));
                setRestaurantBlogs(data["results"]);
              }
            );
          } else {
            getRestaurantBlogs(activePage).then((data) => {
              setPageCount(Math.ceil(data["count"] / 3));
              setRestaurantBlogs(data["results"]);
            });
          }
          handleCloseDelete();
        });
      } else {
        //
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    getRestaurantBlogs(1).then((data) => {
      if (isMounted) {
        setPageCount(Math.ceil(data["count"] / 3));
        setRestaurantBlogs(data["results"]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [authToken]);

  return (
    <>
      <div className="px-3">
        <div className="card" style={{ width: "50rem" }}>
          <div className="card-body">
            <h4 className="card-title">
              Blog posts{" "}
              {ownerStatus["ownerStatus"] && (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 150 }}
                  overlay={renderTooltipAdd}
                >
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      position: "absolute",
                      top: "20px",
                      right: "10px",
                    }}
                    onClick={() => {
                      reset({});
                      handleShow();
                    }}
                  >
                    <HiOutlinePlus className="navIconStyle float-end" />
                  </button>
                </OverlayTrigger>
              )}
            </h4>
            <div className="row row-cols-1 row-cols-md-1 pt-2">
              {restaurantBlogs.map((item, index) => (
                <div key={index}>
                  <Link to={`/blog/${item.id}`}>
                    <div className="col">
                      <div className="card card-body">
                        <span className="float-right font-weight-bold">
                          {formatDate(new Date(Date.parse(item.created_date))) +
                            " ∙ 5 min read"}
                        </span>
                        <h3 style={{ fontSize: "22px" }} className="pt-2">
                          {item.name}{" "}
                          {ownerStatus["ownerStatus"] && (
                            <OverlayTrigger
                              placement="right"
                              delay={{ show: 250, hide: 150 }}
                              overlay={renderTooltip}
                            >
                              <button
                                style={{
                                  border: "none",
                                  background: "none",
                                  position: "absolute",
                                  top: "20px",
                                  right: "10px",
                                }}
                                onClick={(event) => {
                                  event.preventDefault();
                                  reset({
                                    picture: item.picture,
                                    name: item.name,
                                    content: item.content,
                                  });
                                  handleShowItems(item.id);
                                }}
                              >
                                <HiOutlinePencil className="navIconStyle mt-3 float-end" />
                              </button>
                            </OverlayTrigger>
                          )}
                        </h3>
                      </div>
                    </div>
                  </Link>
                  <Modal
                    dialogClassName="modalWidth"
                    show={showItems[item.id]}
                    onHide={() => {
                      handleCloseItems(item.id);
                    }}
                  >
                    <form
                      onSubmit={handleSubmit((data) =>
                        editBlogItem(data, item.id)
                      )}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title> Edit Blog Post </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <figure className="mb-4">
                          <img
                            style={{width: '900px', height:'400px'}}
                            className="img-fluid rounded"
                            src={
                              item.picture ??
                              "https://dummyimage.com/900x400/ced4da/6c757d.jpg"
                            }
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
                            className="form-control"
                            type="file"
                            id="formFile"
                            {...register("picture")}
                          />
                        </div>
                        <div className="mb-4 form-group">
                          <label forhtml="exampleFormControlInput1">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleFormControlInput1"
                            {...register("name")}
                          />
                        </div>
                        <div className="mb-4 form-group">
                          <label forhtml="exampleFormControlTextarea1">
                            Content
                          </label>
                          <textarea
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
                          onClick={() => onClickDelete(item.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                      </Modal.Footer>
                    </form>
                  </Modal>
                  <Modal
                    show={showDelete[item.id]}
                    onHide={() => handleCloseDelete(item.id)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to delete this item?
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        type="button"
                        onClick={() => handleCloseDelete(item.id)}
                        className="btn btn-secondary"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => deleteBlogItem(item.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              ))}
            </div>
            <ReactPaginate
              breakLabel={"..."}
              pageCount={pageCount}
              forcePage={activePage - 1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </div>
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
              Add
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default RestaurantBlogsCard;

import ReactPaginate from "react-paginate";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import "./style.css";
import { HiOutlinePlus, HiOutlinePencil } from "react-icons/hi";

const MenuCard = ({ ownerStatus, menuId }) => {
  const { authToken } = useContext(AuthContext);
  const [foodItems, setFoodItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState({});
  const [showItems, setShowItems] = useState({});
  const [activePage, setActivePage] = useState(1);
  const handleCloseItems = (index) =>
    setShowItems((prevState) => ({
      ...prevState,
      [index]: false,
    }));
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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const setValues = (data) => {
    setPageCount(Math.ceil(data["count"] / 6));
    setFoodItems(data["results"]);
    var showObjs = {};
    data["results"].map((item, index) => {
      showObjs[index] = false;
    });
    setShowItems(showObjs);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit menu item
    </Tooltip>
  );

  const renderTooltipAdd = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add menu item
    </Tooltip>
  );

  const getRestaurantMenu = async (page) => {
    return await fetch(
      `http://127.0.0.1:8000/restaurant/menu/${menuId}/?page=${page}`,
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
    getRestaurantMenu(currentPage).then((data) => {
      setValues(data);
    });
  };

  const addRestaurantMenu = async (data) => {
    await fetch("http://127.0.0.1:8000/restaurant/food/add/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ food_items: [data] }),
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (foodItems.length === 6) {
            var newPage =
              Math.ceil(data["menu"]["food_items"].length / 6) - activePage;
            getRestaurantMenu(activePage + newPage).then((data) => {
              setActivePage(activePage + newPage);
              setValues(data);
            });
          } else {
            getRestaurantMenu(activePage).then((data) => {
              setValues(data);
            });
          }
          handleClose();
        });
      } else {
        //
      }
    });
  };

  const editMenuItem = async (data, index) => {
    await fetch(`http://127.0.0.1:8000/restaurant/food/edit/${index}/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          getRestaurantMenu(activePage).then((data) => {
            setValues(data);
          });
          handleCloseItems(index);
        });
      } else {
        //
      }
    });
  };

  const onClickDelete = (index) => {
    handleCloseItems(index);
    handleShowDelete(index);
  };

  const deleteMenuItem = async (index) => {
    await fetch(`http://127.0.0.1:8000/restaurant/food/edit/${index}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (foodItems.length === 1) {
            getRestaurantMenu(activePage - 1 === 0 ? 1 : activePage - 1).then(
              (data) => {
                setValues(data);
                setActivePage(activePage - 1 == 0 ? 1 : activePage - 1);
              }
            );
          } else {
            getRestaurantMenu(activePage).then((data) => {
              setValues(data);
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
    getRestaurantMenu(1).then((data) => {
      if (isMounted) {
        setPageCount(Math.ceil(data["count"] / 6));
        setFoodItems(data["results"]);
        var showObjs = {};
        data["results"].map((item, index) => {
          showObjs[index] = false;
        });
        setShowItems(showObjs);
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
              Menu
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
            <div className="row row-cols-1 row-cols-md-3 g-1">
              {foodItems.map((item, index) => (
                <div key={index} className="col">
                  <div className="card card-body">
                    <span className="float-right font-weight-bold">
                      ${item.price} - {item.type}
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
                            onClick={() => {
                              reset({
                                name: item.name,
                                description: item.desc,
                                type: item.type,
                                price: item.price,
                              });
                              handleShowItems(item.id);
                            }}
                          >
                            <HiOutlinePencil className="float-end navIconStyle iconEditStyle" />
                          </button>
                        </OverlayTrigger>
                      )}
                      <Modal
                        show={showItems[item.id]}
                        onHide={() => handleCloseItems(item.id)}
                      >
                        <form
                          onSubmit={handleSubmit((data) =>
                            editMenuItem(data, item.id)
                          )}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title> Edit Menu Item </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <select
                              className="form-select form-select-lg mb-3"
                              defaultValue={item.type}
                              {...register("type")}
                            >
                              <option value="Appetizers">Appetizers</option>
                              <option value="Main dish">Main dish</option>
                              <option value="Dessert">Dessert</option>
                            </select>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingPassword"
                                defaultValue={item.name}
                                required
                                {...register("name")}
                              />
                              <label htmlFor="floatingPassword">Name</label>
                            </div>

                            <div className="form-floating mb-3">
                              <textarea
                                className="form-control"
                                id="floatingTextarea2"
                                style={{ height: "120px" }}
                                defaultValue={item.description}
                                {...register("description")}
                              />
                              <label htmlFor="floatingTextarea2">
                                Description
                              </label>
                            </div>

                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="floatingPassword"
                                defaultValue={item.price}
                                required
                                {...register("price", {
                                  pattern: {
                                    value: /^[+-]?([0-9]*[.])?[0-9]+$/,
                                    message: "Please enter a valid price",
                                  },
                                })}
                              />
                              <label htmlFor="floatingPassword">Price</label>
                            </div>
                            {errors.price && (
                              <p className="error-message">
                                {errors.price.message}
                              </p>
                            )}
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
                            onClick={() => deleteMenuItem(item.id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </span>

                    <div className="card-truncate">
                      <h6>{item.name}</h6>
                      <p className="small">{item.description}</p>
                    </div>
                  </div>
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

      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit(addRestaurantMenu)}>
          <Modal.Header closeButton>
            <Modal.Title> Add Menu Item </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <select
              className="form-select form-select-lg mb-3"
              aria-label="Default select example"
              {...register("type")}
            >
              <option value="Appetizers">Appetizers</option>
              <option value="Main dish">Main dish</option>
              <option value="Dessert">Dessert</option>
            </select>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingPassword"
                required
                {...register("name")}
              />
              <label htmlFor="floatingPassword">Name</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                id="floatingTextarea2"
                style={{ height: "120px" }}
                required
                {...register("description")}
              />
              <label htmlFor="floatingTextarea2">Description</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingPassword"
                required
                {...register("price", {
                  pattern: {
                    value: /^[+-]?([0-9]*[.])?[0-9]+$/,
                    message: "Please enter a valid price",
                  },
                })}
              />
              <label htmlFor="floatingPassword">Price</label>
            </div>
            {errors.price && (
              <p className="error-message">{errors.price.message}</p>
            )}
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

export default MenuCard;

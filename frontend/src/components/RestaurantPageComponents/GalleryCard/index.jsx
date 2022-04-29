import ReactPaginate from "react-paginate";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { HiOutlinePlus, HiOutlineMinusCircle } from "react-icons/hi";
import "./style.css";

const RestaurantGalleryCard = ({ ownerStatus, restaurantId }) => {
  const { authToken } = useContext(AuthContext);
  const [galleryImages, setGalleryImages] = useState([]);
  const [show, setShow] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showDelete, setShowDelete] = useState({});
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
  const { register, handleSubmit } = useForm();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add image
    </Tooltip>
  );
  
  const deleteGalleryItem = async (index) => {
    await fetch(`http://127.0.0.1:8000/restaurant/gallery/delete/${index}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (galleryImages.length === 1) {
            getRestaurantGallery(activePage - 1 === 0 ? 1 : activePage - 1).then(
              (data) => {
                setActivePage(activePage - 1 == 0 ? 1 : activePage - 1);
                setPageCount(Math.ceil(data["count"] / 6));
                setGalleryImages(data["results"]);
              }
            );
          } else {
            getRestaurantGallery(activePage).then((data) => {
              setPageCount(Math.ceil(data["count"] / 6));
              setGalleryImages(data["results"]);
            });
          }

          handleCloseDelete(index);
        });
      } else {
        //
      }
    });
  };

  const getRestaurantGallery = async (page) => {
    return await fetch(
      `http://127.0.0.1:8000/restaurant/gallery/${restaurantId}/?page=${page}`,
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
    getRestaurantGallery(currentPage).then((data) => {
      setPageCount(Math.ceil(data["count"] / 6));
      setGalleryImages(data["results"]);
    });
  };

  const addRestaurantGallery = async (data) => {
    var formData = new FormData();
    formData.append("image", data.image[0]);

    await fetch("http://127.0.0.1:8000/restaurant/gallery/add/", {
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
          getRestaurantGallery(1).then((data) => {
            setPageCount(Math.ceil(data["count"] / 6));
            setGalleryImages(data["results"]);
          });
        });
      } else {
        //
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    getRestaurantGallery(1).then((data) => {
      if (isMounted) {
        setPageCount(Math.ceil(data["count"] / 6));
        setGalleryImages(data["results"]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [authToken, restaurantId]);

  return (
    <>
      <div className="px-3">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Gallery{" "}
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
                    onClick={handleShow}
                  >
                    <HiOutlinePlus className="navIconStyle float-end" />
                  </button>
                </OverlayTrigger>
              )}
            </h4>
            <div className="row">
              {galleryImages.map((item, index) => (
                <div key={index} className="col">
                  <div className="imageBox">
                    {ownerStatus["ownerStatus"] && (
                      <HiOutlineMinusCircle
                        onClick={() => handleShowDelete(item.id)}
                        className="topRightIcon"
                      />
                    )}
                    <img
                      key={index}
                      src={item.image}
                      className="galleryImages"
                      alt="Gallery image"
                    />
                  </div>
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
                        onClick={() => deleteGalleryItem(item.id)}
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
      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit(addRestaurantGallery)}>
          <Modal.Header closeButton>
            <Modal.Title> Add Gallery Image </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <label forhtml="formFile" className="form-label">
                Image
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                {...register("image")}
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

export default RestaurantGalleryCard;

import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import "./style.css";
import { HiOutlinePencil } from "react-icons/hi";

const RestaurantInfoCard = ({ userId, ownerStatus, restaurantId }) => {
  const { authToken } = useContext(AuthContext);
  const [followStatus, setFollowStatus] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [likeStatus, setLikeStatus] = useState(false);
  const [updatedRestaurantInfo, setUpdatedRestaurantInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [logoErrorMessage, setLogoErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setLogoErrorMessage("");
    setErrorMessage("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const { register, handleSubmit, reset } = useForm();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit restaurant info
    </Tooltip>
  );

  const formatNumber = (number) => {
    number = number.substring(2);
    return (
      number.slice(0, 3) + "-" + number.slice(3, 6) + "-" + number.slice(6)
    );
  };

  const followRestaurant = async (followStatus) => {
    await fetch(
      `http://127.0.0.1:8000/network/follow/restaurant/${restaurantId}/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ follow_status: followStatus }),
      }
    ).then((response) => {
      if (response.status === 200) {
        setFollowStatus(followStatus);
      } else {
        //
      }
    });
  };

  const likeRestaurant = async (likeStatus) => {
    await fetch(
      `http://127.0.0.1:8000/network/like/restaurant/${restaurantId}/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ like_status: likeStatus }),
      }
    ).then((response) => {
      if (response.status === 200) {
        setLikeStatus(likeStatus);
      } else {
        //
      }
    });
  };

  useEffect(() => {
    const getRestaurantInfo = async () => {
      return await fetch(
        `http://127.0.0.1:8000/restaurant/view/${restaurantId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      });
    };
    const getRestaurantLikes = async (restaurantId) => {
      return await fetch(
        `http://127.0.0.1:8000/network/restaurant/likes/${restaurantId}/`,
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
    const getRestaurantFollows = async (restaurantId) => {
      return await fetch(
        `http://127.0.0.1:8000/network/restaurant/follows/${restaurantId}/`,
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

    let isMounted = true;
    getRestaurantFollows(restaurantId).then((data) => {
      if (isMounted) {
        setFollowCount(data["count"]);
        data["results"].map((item) => {
          if (item.id === userId) {
            setFollowStatus(true);
          }
        });
      }
    });
    getRestaurantLikes(restaurantId).then((data) => {
      if (isMounted) {
        data["results"].map((item) => {
          if (item.id === userId) {
            setLikeStatus(true);
          }
        });
      }
    });
    getRestaurantInfo(restaurantId).then((data) => {
      if (isMounted) {
        reset(data);
        setUpdatedRestaurantInfo(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [authToken]);

  const updateRestaurantInfo = async (data) => {
    var formData = new FormData();
    if (data.logo && data.logo.length === 0) {
      formData.append("logo", "");
    } else if (
      typeof data.logo !== "string" &&
      data.logo &&
      data.logo.length !== 0
    ) {
      formData.append("logo", data.logo[0]);
    }
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("phone_number", data.phone_number);
    formData.append("desc", data.desc);
    formData.append("postal_code", data.postal_code);

    await fetch("http://127.0.0.1:8000/restaurant/update/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          reset(data);
          handleClose();
          setUpdatedRestaurantInfo(data);
        });
      } else {
        response.json().then((data) => {
          if ("phone_number" in data) {
            if (
              data["phone_number"].toString() !==
              "The phone number entered is not valid."
            ) {
              setErrorMessage(
                data["phone_number"].toString().charAt(0).toUpperCase() +
                  data["phone_number"].toString().slice(1)
              );
            } else {
              setErrorMessage(data["phone_number"] + " Ex: +12892329045");
            }
          }
          if ("logo" in data) {
            setLogoErrorMessage(data["logo"]);
          }
        });
      }
    });
  };

  if (Object.keys(updatedRestaurantInfo).length === 0) {
    return <></>;
  } else {
    return (
      <>
        <div className="card-body">
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
              >
                <HiOutlinePencil
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "0 !important",
                  }}
                  onClick={handleShow}
                  className="navIconStyle float-end"
                />
              </button>
            </OverlayTrigger>
          )}
          <div className="col">
            <div className="row">
              <div className="col-md-3">
                <img
                  src={
                    updatedRestaurantInfo["logo"] ??
                    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png"
                  }
                  className="restaurant-image"
                  alt="Restaurant"
                />
              </div>
              <div className="col-md-9">
                <h2>{updatedRestaurantInfo["name"]}</h2>
                <p style={{ fontSize: "12px", color: "gray" }}>{`${
                  updatedRestaurantInfo["address"]
                } ${updatedRestaurantInfo["postal_code"]} ∙ ${formatNumber(
                  updatedRestaurantInfo["phone_number"]
                )} ∙ ${followCount} Followers`}</p>
                <p style={{ fontSize: "medium" }}>
                  {updatedRestaurantInfo["desc"]}
                </p>
              </div>
            </div>
          </div>
          {!ownerStatus["ownerStatus"] && (
            <div>
              {!likeStatus ? (
                <i
                  style={{ cursor: "pointer" }}
                  className="pt-3 float-end bi bi-heart"
                  onClick={() => likeRestaurant(true, restaurantId)}
                />
              ) : (
                <i
                  style={{ color: "red", cursor: "pointer" }}
                  className="pt-3 float-end bi bi-heart-fill"
                  onClick={() => likeRestaurant(false, restaurantId)}
                />
              )}
            </div>
          )}
          {!ownerStatus["ownerStatus"] && (
            <div className="col p-2">
              {followStatus ? (
                <button
                  type="submit"
                  className="follow-btn rounded-pill btn btn-secondary"
                  onClick={() => followRestaurant(false, restaurantId)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  type="submit"
                  className="follow-btn rounded-pill btn btn-primary"
                  onClick={() => followRestaurant(true, restaurantId)}
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
        <Modal show={show} onHide={handleClose}>
          <form onSubmit={handleSubmit(updateRestaurantInfo)}>
            <Modal.Header closeButton>
              <Modal.Title> Edit Restaurant Info </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                <label forhtml="formFile" className="form-label">
                  Logo
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  {...register("logo")}
                />
              </div>
              {logoErrorMessage !== "" && (
                <p className="error-message">{logoErrorMessage}</p>
              )}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  defaultValue={updatedRestaurantInfo["name"]}
                  required
                  {...register("name")}
                />
                <label htmlFor="floatingInput">Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingPassword"
                  defaultValue={updatedRestaurantInfo["address"]}
                  required
                  {...register("address")}
                />
                <label htmlFor="floatingPassword">Address</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  required
                  {...register("postal_code")}
                />
                <label htmlFor="floatingInput">Postal Code</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingPassword"
                  defaultValue={updatedRestaurantInfo["phone_number"]}
                  required
                  {...register("phone_number")}
                />
                <label htmlFor="floatingPassword">Phone Number</label>
              </div>
              {errorMessage !== "" && (
                <p className="error-message">{errorMessage}</p>
              )}
              <div className="form-floating mb-3">
                <textarea
                  required
                  className="form-control"
                  id="floatingTextarea2"
                  style={{ height: "120px" }}
                  defaultValue={updatedRestaurantInfo["desc"]}
                  {...register("desc")}
                />
                <label htmlFor="floatingTextarea2">Description</label>
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
  }
};

export default RestaurantInfoCard;

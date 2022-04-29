import { Modal } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";
import "./style.css";

const CreateRestaurant = () => {
  let navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [userNotificatons, setUserNotificatons] = useOutletContext();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setLogoErrorMessage("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [logoErrorMessage, setLogoErrorMessage] = useState("");

  useEffect(() => {
    const getUserNotifications = async () => {
      await fetch("http://127.0.0.1:8000/account/notification/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setUserNotificatons(data["results"]);
          });
        } else {
          //
        }
      });
    };
    const getRestaurantInfo = async () => {
      await fetch("http://127.0.0.1:8000/restaurant/update/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            navigate(`/restaurant/${data.id}`);
          });
        } else {
        }
      });
    };
    getRestaurantInfo();
    getUserNotifications();
  }, []);

  const createMenu = async (data) => {
    await fetch("http://127.0.0.1:8000/restaurant/menu/add/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ food_items: [] }),
    }).then(() => {
      handleClose();
      navigate(`/restaurant/${data["restaurant"].id}`);
    });
  };

  const createRestaurant = async (data) => {
    var formData = new FormData();
    if (data.logo && data.logo.length !== 0) {
      formData.append("logo", data.logo[0]);
    }
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("phone_number", data.phone_number);
    formData.append("desc", data.desc);
    formData.append("postal_code", data.postal_code);

    await fetch("http://127.0.0.1:8000/restaurant/create/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          createMenu(data);
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

  return (
    <>
      <div className="body">
        <div className="container-fluid">
          <div style={{ paddingTop: "20%" }} className="col-sm-12 text-center">
            <h3 className="message">Looks like you dont have a restaurant</h3>
            <a
              className="btn btn-primary cart-btn-transform m-3"
              onClick={handleShow}
            >
              Create a restaurant
            </a>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit(createRestaurant)}>
          <Modal.Header closeButton>
            <Modal.Title> Add restaurant info </Modal.Title>
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
              Add
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CreateRestaurant;

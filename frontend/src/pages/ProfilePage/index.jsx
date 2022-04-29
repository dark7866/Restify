import { Toast, ToastContainer } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import "./style.css";

const ProfilePage = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm({ mode: "onChange" });
  const [userNotificatons, setUserNotificatons] = useOutletContext();
  const [userProfile, setUserProfle] = useState("");
  const { authToken } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageServer, setErrorMessageServer] = useState([]);
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [logoErrorMessage, setLogoErrorMessage] = useState("");
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);

  const handleChangeImage = (e) => {
    setUserProfle(URL.createObjectURL(e.target.files[0]));
  };

  const clickProfile = () => {
    document.getElementById("myfile").click();
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/account/edit/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setUserProfle(data["avatar"]);
          reset(data);
        });
      } else {
        navigate("/");
      }
    });
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
    getUserNotifications();
  }, [authToken, navigate, reset]);

  const onSubmit = (data) => {
    var formData = new FormData();
    if (data.avatar && data.avatar.length === 0) {
      formData.append("avatar", "");
    } else if (
      typeof data.avatar !== "string" &&
      data.avatar &&
      data.avatar.length !== 0
    ) {
      formData.append("avatar", data.avatar[0]);
    }
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    if (data.phone_number !== null) {
      formData.append("phone_number", data.phone_number);
    }

    fetch("http://127.0.0.1:8000/account/edit/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setUserProfle(data["avatar"]);
          setLogoErrorMessage("");
          setErrorMessage("");
          toggleShowB();
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
          if ("avatar" in data) {
            setLogoErrorMessage(data["avatar"]);
          }
        });
      }
    });
  };

  const onSubmitPassword = (data) => {
    fetch("http://127.0.0.1:8000/account/change_password/", {
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
          setErrorMessagePassword("");
          setErrorMessageServer([]);
          toggleShowA();
        });
      } else {
        response.json().then((data) => {
          if ("old_password" in data) {
            setErrorMessagePassword(data["old_password"]);
          } else if ("password" in data) {
            setErrorMessageServer(data["password"]);
          }
        });
      }
    });
  };

  return (
    <>
      <div className="body">
        <div className="d-flex container-sm justify-content-center">
          <div className="card" style={{ width: "60rem" }}>
            <div className="row-md-auto">
              <div className="col">
                <div className="d-flex align-items-start p-4">
                  <div
                    className="nav flex-column nav-pills me-3"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <button
                      className="nav-link active"
                      id="v-pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-home"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-home"
                      aria-selected="true"
                    >
                      Home
                    </button>
                    <button
                      className="nav-link"
                      id="v-pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-profile"
                      aria-selected="false"
                    >
                      Change Password
                    </button>
                    <button
                      className="nav-link"
                      id="v-pills-messages-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-messages"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-messages"
                      aria-selected="false"
                    >
                      Contact Us
                    </button>
                  </div>
                  <div className="tab-content" id="v-pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="v-pills-home"
                      role="tabpanel"
                      aria-labelledby="v-pills-home-tab"
                    >
                      <div className="row">
                        <div className="col">
                          <div className="justify-content-center">
                            <div
                              onChange={(e) => handleChangeImage(e)}
                              className="d-flex flex-column align-items-center text-center p-5"
                            >
                              <img
                                onClick={() => clickProfile()}
                                id="blah"
                                src={
                                  userProfile ??
                                  "https://wretched.org/wp-content/uploads/2017/09/Anon-profile.png"
                                }
                                className="profileTab rounded-circle mt-5"
                                width="90"
                                alt="profile"
                              />
                              <input
                                {...register("avatar")}
                                type="file"
                                id="myfile"
                                style={{ display: "none" }}
                              />
                            </div>
                            {logoErrorMessage !== "" && (
                              <p className="error-message">
                                {logoErrorMessage}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-auto">
                          <div className="p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="text-right">Edit your profile</h6>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="row">
                                <div className="col ">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="floatingInput_firstName"
                                      required
                                      {...register("first_name")}
                                    />
                                    <label htmlFor="floatingInput_firstName">
                                      First Name
                                    </label>
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="floatingInput_lastName"
                                      required
                                      {...register("last_name")}
                                    />
                                    <label htmlFor="floatingInput_lastName">
                                      Last Name
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="form-floating mb-3">
                                <input
                                  type="email"
                                  className="form-control"
                                  id="floatingInput_email"
                                  required
                                  {...register("email", {
                                    required: true,
                                    pattern: {
                                      value:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                      message:
                                        "Please enter valid email address",
                                    },
                                  })}
                                />
                                <label htmlFor="floatingInput_email">
                                  Email address
                                </label>
                              </div>
                              {errors.email && (
                                <p className="error-message">
                                  {errors.email.message}
                                </p>
                              )}
                              <div className="form-floating mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="floatingInput_phone"
                                  placeholder="1"
                                  {...register("phone_number")}
                                />
                                <label htmlFor="floatingInput_phone">
                                  Phone Number
                                </label>
                              </div>
                              {errorMessage !== "" && (
                                <p className="error-message">{errorMessage}</p>
                              )}
                              <div className="text-center">
                                <button
                                  className="btn btn-primary profile-button"
                                  id="liveToastBtn"
                                  type="submit"
                                >
                                  Save Profile
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-profile"
                      role="tabpanel"
                      aria-labelledby="v-pills-profile-tab"
                    >
                      <div
                        className="tab-pane fade show active"
                        id="v-pills-home"
                        role="tabpanel"
                        aria-labelledby="v-pills-home-tab"
                      >
                        <div className="row" style={{ width: "40em" }}>
                          <div className="col">
                            <div className="p-3">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="text-right">
                                  Change your password
                                </h6>
                              </div>
                              <form onSubmit={handleSubmit2(onSubmitPassword)}>
                                <div className="form-floating mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="currentpass"
                                    required
                                    placeholder="password"
                                    {...register2("old_password")}
                                  />
                                  <label htmlFor="floatingInput">
                                    Current password
                                  </label>
                                </div>
                                {errorMessagePassword !== "" && (
                                  <p className="error-message">
                                    {errorMessagePassword}
                                  </p>
                                )}
                                <div className="form-floating mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="newpassword"
                                    placeholder="newpassword"
                                    required
                                    {...register2("password", {
                                      required: "You must specify a password",
                                      minLength: {
                                        value: 8,
                                        message:
                                          "Password must have at least 8 characters",
                                      },
                                    })}
                                  />
                                  <label htmlFor="floatingInput">
                                    New password
                                  </label>
                                </div>
                                {errors2.password && (
                                  <p className="error-message">
                                    {errors2.password.message}
                                  </p>
                                )}
                                <div className="form-floating mb-3">
                                  <input
                                    type="password"
                                    className="form-control"
                                    placeholder="newpassword2"
                                    id="newpassword2"
                                    required
                                    {...register2("password2", {
                                      required: true,
                                      validate: (value) => {
                                        if (watch2("password") !== value) {
                                          return "Your passwords do no match";
                                        }
                                      },
                                    })}
                                  />
                                  <label htmlFor="floatingInput">
                                    Repeat new password
                                  </label>
                                </div>
                                {errors2.password2 && (
                                  <p className="error-message">
                                    {errors2.password2.message}
                                  </p>
                                )}
                                {errorMessageServer &&
                                  errorMessageServer.map((item, index) => (
                                    <p key={index} className="error-message">
                                      {item}
                                    </p>
                                  ))}
                                <div className="text-center">
                                  <button
                                    className="btn btn-primary profile-button"
                                    type="submit"
                                    value="submit"
                                  >
                                    Change Password
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-messages"
                      role="tabpanel"
                      aria-labelledby="v-pills-messages-tab"
                    >
                      <div
                        className="tab-pane fade show active"
                        id="v-pills-home"
                        role="tabpanel"
                        aria-labelledby="v-pills-home-tab"
                      >
                        <div className="row" style={{ width: "40em" }}>
                          <div className="col">
                            <div className="p-3">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="text-right">Contact Us</h6>
                              </div>
                              <form>
                                <div className="form-floating mb-3">
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    required
                                  />
                                  <label htmlFor="floatingInput">Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                  <textarea
                                    className="form-control"
                                    placeholder="Leave a comment here"
                                    id="floatingTextarea2"
                                    style={{ height: "120px" }}
                                  ></textarea>
                                  <label htmlFor="floatingTextarea2">
                                    Comments
                                  </label>
                                </div>
                                <div className="text-center">
                                  <button
                                    className="btn btn-primary profile-button"
                                    style={{ width: "10rem" }}
                                    type="button"
                                  >
                                    Send
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer className="p-3" position="bottom-start">
          <Toast
            bg="success"
            delay={3000}
            show={showA}
            onClose={toggleShowA}
            autohide
          >
            <Toast.Body className="text-white">
              Password was changed successfully
            </Toast.Body>
          </Toast>
        </ToastContainer>
        <ToastContainer className="p-3" position="bottom-start">
          <Toast
            bg="success"
            delay={3000}
            show={showB}
            onClose={toggleShowB}
            autohide
          >
            <Toast.Body className="text-white">
              Profile information was changed successfully
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </>
  );
};

export default ProfilePage;

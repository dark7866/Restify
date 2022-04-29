import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";

const SignUpModal = () => {
  let navigate = useNavigate();
  const { setAuthToken } = useContext(AuthContext);
  const {
    watch,
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm({ mode: "onChange" });
  const [errorMessage, setErrorMessage] = useState([]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const login = (data) => {
    fetch("http://127.0.0.1:8000/account/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        setAuthToken(json["access"]);
        localStorage["token"] = json["access"];
        document.querySelector(".modal-open").style.overflow = "scroll";
        document.querySelector(".modal-backdrop").remove();
        navigate("/");
      });
  };

  const onSubmit = (data) => {
    fetch("http://127.0.0.1:8000/account/register/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200) {
        var loginData = { email: data["email"], password: data["password"] };
        login(loginData);
      } else {
        response.json().then((data) => {
          setErrorMessage([]);
          if ("password" in data) {
            setErrorMessage((prevState) => [...prevState, ...data["password"]]);
          }
          if ("email" in data) {
            setErrorMessage((prevState) => [...prevState, ...data["email"]]);
          }
        });
      }
    });
  };

  useEffect(() => {
    document
      .getElementById("signUpModal")
      .addEventListener("hidden.bs.modal", function () {
        clearErrors();
        setErrorMessage("");
        document.getElementById("signUpForm").reset(); // Just clear the contents.
      });
  });

  return (
    <>
      <div
        className="modal fade"
        id="signUpModal"
        aria-labelledby="signUpModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="signUpModalLabel">
                Sign Up
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="signUpForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput_modalName"
                        required
                        {...register("first_name", {
                          required: true,
                        })}
                      />
                      <label htmlFor="floatingInput_modalName">
                        First Name
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput_modalLast"
                        required
                        {...register("last_name", {
                          required: true,
                        })}
                      />
                      <label htmlFor="floatingInput_modalLast">Last Name</label>
                    </div>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    required
                    id="floatingInput_Modalemail"
                    {...register("email", {
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter valid email address",
                      },
                    })}
                  />
                  <label htmlFor="floatingInput_Modalemail">
                    Email address
                  </label>
                </div>
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword_Modal2"
                    required
                    {...register("password", {
                      required: "You must specify a password",
                      minLength: {
                        value: 8,
                        message: "Password must have at least 8 characters",
                      },
                    })}
                  />
                  <label htmlFor="floatingPassword_Modal2">Password</label>
                </div>

                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}

                <div className="form-floating mb-3">
                  <input
                    name="password_repeat"
                    type="password"
                    className="form-control"
                    id="floatingPassword_Modal22"
                    required
                    {...register("password2", {
                      required: true,
                      validate: (value) => {
                        if (watch("password") !== value) {
                          return "Your passwords do no match";
                        }
                      },
                    })}
                  />
                  <label htmlFor="floatingPassword_Modal22">
                    Confirm Password
                  </label>
                </div>

                {errors.password2 && (
                  <p className="error-message">{errors.password2.message}</p>
                )}
                {errorMessage &&
                  errorMessage.map((item, index) => (
                    <p key={index} className="error-message">
                      {capitalizeFirstLetter(item)}
                    </p>
                  ))}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="main-sign-in rounded-pill btn btn-primary"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <div>
                Already a member?{" "}
                <a
                  className="textColor"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  data-bs-target="#loginModal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpModal;

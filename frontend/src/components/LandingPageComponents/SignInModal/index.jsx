import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";

const SignInModal = () => {
  let navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthToken } = useContext(AuthContext);

  const onSubmit = (data) => {
    fetch("http://127.0.0.1:8000/account/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setAuthToken(data["access"]);
          localStorage["token"] = data["access"];
          document.querySelector(".modal-open").style.overflow = "scroll";
          document.querySelector(".modal-backdrop").remove();
          navigate("/");
        });
      } else {
        setErrorMessage("The email or password you have entered is incorrect");
      }
    });
  };

  useEffect(() => {
    document
      .getElementById("loginModal")
      .addEventListener("hidden.bs.modal", function () {
        setErrorMessage("");
        document.getElementById("loginForm").reset(); // Just clear the contents.
      });
  });

  return (
    <>
      <div
        className="modal fade"
        id="loginModal"
        aria-labelledby="loginModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="loginModal">
                Sign In
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput_modalEmail"
                    required
                    {...register("email", {
                      required: true,
                    })}
                  />
                  <label htmlFor="floatingInput_modalEmail">
                    Email address
                  </label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword_Modal"
                    required
                    {...register("password", {
                      required: true,
                    })}
                  />
                  <label htmlFor="floatingPassword_Modal">Password</label>
                </div>

                {errorMessage !== "" && (
                  <p className="error-message">{errorMessage}</p>
                )}

                <a
                  className="textColor"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  data-bs-toggle="modal"
                  data-bs-target="#forgotPassword"
                >
                  <div className="mb-3 textColor">Forgot password?</div>
                </a>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="main-sign-in rounded-pill btn btn-primary"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <div>
                Not a member yet?{" "}
                <a
                  className="textColor"
                  data-bs-target="#signUpModal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInModal;

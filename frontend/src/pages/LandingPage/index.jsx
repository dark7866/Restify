import "./style.css";
import { useState, useContext } from "react";
import logo from "../../assets/backgroundImage.svg";
import {
  ForgotPasswordModal,
  SignInModal,
  SignUpModal,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/AuthContext";

const LandingPage = () => {
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
          navigate("/");
        });
      } else {
        setErrorMessage("The email or password you have entered is incorrect");
      }
    });
  };

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Restify
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    style={{ textDecoration: "none", cursor: "pointer" }}
                    aria-current="page"
                    data-bs-toggle="modal"
                    data-bs-target="#signUpModal"
                  >
                    Sign Up
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    style={{ textDecoration: "none", cursor: "pointer" }}
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    Sign In
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <header className="page-header">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h1 className="main-heading">
                  Join a community of restaurant lovers
                </h1>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="form-container"
                >
                  <div className="form-floating col-8 mb-3">
                    <input
                      type="email"
                      required
                      className="form-control"
                      {...register("email", {
                        required: true,
                      })}
                    />
                    <label htmlFor="floatingInput_email">Email address</label>
                  </div>

                  <div className="form-floating col-8 mb-3">
                    <input
                      required
                      type="password"
                      className="form-control"
                      {...register("password", {
                        required: true,
                      })}
                    />
                    <label htmlFor="floatingPassword_Password">Password</label>
                  </div>

                  {errorMessage !== "" && (
                    <p className="error-message">{errorMessage}</p>
                  )}

                  <a
                    className="textColor"
                    style={{ textDecoration: "none", cursor: "pointer" }}
                    data-bs-toggle="modal"
                    data-bs-target="#forgotPassword"
                  >
                    <div className="mb-3 textColor">Forgot password?</div>
                  </a>
                  <div className="d-grid col-8">
                    <button
                      type="submit"
                      className="main-sign-in rounded-pill btn btn-primary"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <img alt="logo" className="landing-page-image" src={logo} />
              </div>
            </div>
          </div>
        </header>
      </div>

      <footer className="copyright-footer text-center p-4">
        <p>@ 2022 CSC309 Project</p>
      </footer>

      <SignInModal />

      <SignUpModal />

      <ForgotPasswordModal />
    </>
  );
};

export default LandingPage;

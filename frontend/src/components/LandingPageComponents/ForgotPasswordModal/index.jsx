const ForgotPasswordModal = () => {
  return (
    <>
      <div
        className="modal fade"
        id="forgotPassword"
        aria-labelledby="forgotPassword"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title" id="forgotPassword">
                Forgot Password
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  Please enter your email and we will send you a link
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput_resetEmail"
                    required
                  />
                  <label htmlFor="floatingInput_resetEmail">
                    Email address
                  </label>
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="main-sign-in rounded-pill btn btn-primary"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;

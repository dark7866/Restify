import "./style.css";
import { Toast, ToastContainer } from "react-bootstrap";
import { useParams, useOutletContext } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const BlogPostPage = () => {
  const [blogInfo, setBlogInfo] = useState({});
  const [userNotifications, setUserNotificatons] = useOutletContext();
  const [likeCount, setLikeCount] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const { blogId } = useParams();
  const [likeStatus, setLikeStatus] = useState(false);
  const { authToken } = useContext(AuthContext);
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);

  const formatDate = (dateObj) => {
    let month = dateObj.toLocaleString("default", { month: "long" });
    let date = dateObj.getDate();
    let year = dateObj.getFullYear();

    return `${month} ${date}, ${year}`;
  };

  const likeBlogPost = async (likeStatus, blogId) => {
    await fetch(`http://127.0.0.1:8000/network/like/blog/${blogId}/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ like_status: likeStatus }),
    }).then((response) => {
      if (response.status === 200) {
        setLikeCount((prevCount) =>
          likeStatus ? prevCount + 1 : prevCount - 1
        );
        setLikeStatus(likeStatus);
      } else {
        toggleShowA();
      }
    });
  };

  const checkLikeStatus = (idMap) => {
    fetch("http://127.0.0.1:8000/account/edit/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          idMap.map((item) => {
            if (item.id === data.id) {
              setLikeStatus(true);
            }
          });
        });
      } else {
        //
      }
    });
  };

  useEffect(() => {
    const getLikes = (id) => {
      fetch(`http://127.0.0.1:8000/network/blog/likes/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setLikeCount(data["count"]);
            checkLikeStatus(data["results"]);
          });
        } else {
          //
        }
      });
    };

    fetch(`http://127.0.0.1:8000/restaurant/blog/${blogId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setBlogInfo(data);
          getLikes(blogId);
          setRestaurantName(data.restaurant["name"]);
        });
      } else {
        //
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
  }, [authToken, blogId]);

  return (
    <>
      <div className="body">
        <div className="container pt-5">
          <div className="row">
            <div className="col-lg-8">
              <article>
                <header className="mb-4">
                  <h1 className="fw-bolder mb-1">{blogInfo["name"]}</h1>
                  <div className="row">
                    <div className="col-sm">
                      <div className="text-muted fst-italic mb-2">
                        Posted on{" "}
                        {formatDate(
                          new Date(Date.parse(blogInfo["created_date"]))
                        )}{" "}
                        by {restaurantName}
                      </div>
                    </div>
                    <div className="col">
                      <span className="float-end">{likeCount}</span>
                      {!likeStatus ? (
                        <i
                          style={{ paddingLeft: "385px", cursor: "pointer" }}
                          className="bi bi-heart"
                          onClick={() => likeBlogPost(true, blogId)}
                        />
                      ) : (
                        <i
                          style={{
                            color: "red",
                            paddingLeft: "385px",
                            cursor: "pointer",
                          }}
                          className="bi bi-heart-fill"
                          onClick={() => likeBlogPost(false, blogId)}
                        />
                      )}
                    </div>
                  </div>
                </header>
                <figure className="mb-4">
                  <img
                    style={{ width: "900px", height: "400px" }}
                    className="img-fluid rounded"
                    src={
                      blogInfo["picture"] ??
                      "https://dummyimage.com/900x400/ced4da/6c757d.jpg"
                    }
                    alt="..."
                  />
                </figure>
                <section className="mb-5">
                  <p className="fs-5 mb-4">{blogInfo["content"]}</p>
                </section>
              </article>
            </div>
          </div>
        </div>
        <ToastContainer className="p-3 position-fixed" position="bottom-start">
          <Toast
            bg="danger"
            delay={1500}
            show={showA}
            onClose={toggleShowA}
            autohide
          >
            <Toast.Body className="text-white">
              Cannot like your own blog post
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </>
  );
};

export default BlogPostPage;

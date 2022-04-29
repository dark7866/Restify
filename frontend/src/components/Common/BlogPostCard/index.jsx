import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import './styles.css';

const BlogPostCard = ({ blogData }) => {
  const { authToken } = useContext(AuthContext);
  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantFollows, setRestaurantFollows] = useState(0);

  const getFollowers = (restaurantId) => {
    fetch(`http://127.0.0.1:8000/network/restaurant/follows/${restaurantId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setRestaurantFollows(data["count"]);
        });
      } else {
        //
      }
    });
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/restaurant/view/${blogData["restaurant"]}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setRestaurantData(data);
          getFollowers(blogData["restaurant"]);
        });
      } else {
        //
      }
    });
  }, []);

  return (
    <>
      <div className="px-3">
        <div className="card" style={{ width: "680px" }}>
          <div className="card-body">
            <div className="row row-cols-2">
              <div className="col-md-1">
                <Link to={`/restaurant/${blogData["restaurant"]}`}>
                  <img
                    src={
                      restaurantData["logo"] ??
                      "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png"
                    }
                    className="post-image"
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="col-md-9" style={{ marginLeft: "10px" }}>
                <Link  to={`/restaurant/${blogData["restaurant"]}`}>
                  <h5 className="resName" style={{ fontSize: "20px" }}>{restaurantData["name"]}</h5>
                </Link>
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "-10px",
                    color: "gray",
                  }}
                >
                  {restaurantFollows} Followers
                </p>
              </div>
            </div>
            <Link to={`/blog/${blogData["id"]}`}>
              <div className="blog-post card mb-3">
                <img
                  src={
                    blogData["picture"] ??
                    "https://dummyimage.com/900x400/ced4da/6c757d.jpg"
                  }
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{blogData["name"]}</h5>
                  <p className="card-text">{blogData["content"].substring(0, 50)+"..."}</p>
                  <p className="card-text">
                    <small className="text-muted">1 min read</small>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostCard;

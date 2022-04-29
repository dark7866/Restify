import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

const SearchResultCard = ({ restaurantId, image, title, location, desc }) => {
  const { authToken } = useContext(AuthContext);
  const [restaurantFollows, setRestaurantFollows] = useState(0);

  const getFollowers = () => {
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
    getFollowers();
  }, []);

  return (
    <>
      <Link to={`/restaurant/${restaurantId}`}>
        <div className="card">
          <div className="card-body">
            <div className="col">
              <div className="row">
                <div className="col-3">
                  <img src={image} className="restaurant-image" />
                </div>
                <div className="col-7">
                  <h2>{title}</h2>
                  <p style={{ fontSize: "12px", color: "gray" }}>
                    {location + ` ∙ ${restaurantFollows} Followers`}
                  </p>
                  <p style={{ fontSize: "medium" }}>{desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default SearchResultCard;

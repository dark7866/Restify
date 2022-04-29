import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const LikedByCard = ({ restaurantId }) => {
  const { authToken } = useContext(AuthContext);
  const [likedBy, setLikedBy] = useState([]);
  const [likedByCount, setLikedByCount] = useState(0);

  const getRestaurantLikes = async () => {
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

  useEffect(() => {
    let isMounted = true;
    getRestaurantLikes().then((data) => {
      if (isMounted) {
        setLikedBy(data["results"]);
        setLikedByCount(data["count"]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Liked by - {likedByCount}</h5>
            <div className="row row-cols-4">
              {likedBy.map((item, index) => (
                <div key={index} className="col">
                  <div className="p-2">
                    <img
                      src={
                        item.avatar ??
                        "https://wretched.org/wp-content/uploads/2017/09/Anon-profile.png"
                      }
                      className="like-image"
                      alt="avatar"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LikedByCard;

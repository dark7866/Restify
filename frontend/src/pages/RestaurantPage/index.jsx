import { useEffect, useContext, useState } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import {
  LikedByCard,
  MenuCard,
  RestaurantBlogsCard,
  RestaurantCommentsCard,
  RestaurantGalleryCard,
  RestaurantInfoCard,
} from "../../components";
import { AuthContext } from "../../contexts/AuthContext";
import "./style.css";

const RestaurantPage = () => {
  const { authToken } = useContext(AuthContext);
  const { restaurantId } = useParams();
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [userNotificatons, setUserNotificatons] = useOutletContext();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const getRestaurantInfo = async () => {
      await fetch(`http://127.0.0.1:8000/restaurant/view/${restaurantId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setRestaurantInfo(data);
          });
        }
      });
    };
    const getUserInfo = async () => {
      await fetch("http://127.0.0.1:8000/account/edit/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) =>
        response.json().then((data) => {
          setUserInfo(data);
        })
      );
    };
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
    getUserInfo();
    getRestaurantInfo();
  }, [authToken, restaurantId]);

  var similarRestaurants = [
    {
      link: 6,
      name: "Giulietta",
      info: "972 College St M6H1A5 ∙ 416-964-0606",
      image:
        "https://3di6zv3beqwj3om56f47wlza-wpengine.netdna-ssl.com/wp-content/uploads/2020/06/Giulietta_2020_00_1024.jpg",
    },
    {
      link: 7,
      name: "Edulis",
      info: "6660 Kennedy Rd #1, Mississauga ∙ 905-696-6966",
      image:
        "https://3di6zv3beqwj3om56f47wlza-wpengine.netdna-ssl.com/wp-content/uploads/2020/06/Edulis_2020_00_1024.jpg",
    },
    {
      link: 8,
      name: "Kissa Tanto",
      info: "263 E Pender St V6A1T8 ∙ 778-379-8078",
      image:
        "https://3di6zv3beqwj3om56f47wlza-wpengine.netdna-ssl.com/wp-content/uploads/2020/06/Kissa-_Tanto_00a.jpg",
    },
  ];

  const RenderRestaurantPage = (ownerStatus) => {
    return (
      <>
        <div className="body">
          <div className="container px-4">
            <div className="row">
              <div className="col">
                <div className="px-3">
                  <div className="card" style={{ width: "50rem" }}>
                    <RestaurantInfoCard
                      userId={userInfo["id"]}
                      ownerStatus={ownerStatus}
                      restaurantId={restaurantId}
                    />
                  </div>
                </div>

                <MenuCard ownerStatus={ownerStatus} menuId={restaurantId} />

                <RestaurantBlogsCard
                  ownerStatus={ownerStatus}
                  restaurantId={restaurantId}
                />

                <RestaurantGalleryCard
                  ownerStatus={ownerStatus}
                  restaurantId={restaurantId}
                />

                <RestaurantCommentsCard restaurantId={restaurantId} />
              </div>

              <div className="col sticky">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title pb-2">Similar Restaurants</h5>
                    {similarRestaurants.map((item, index) => (
                      <Link key={index} to={`/restaurant/${item.link}`}>
                        <div className="row">
                          <div className="col-md-3">
                            <img
                              src={item.image}
                              className="similar-image"
                              alt="Boat on Calm Water"
                            />
                          </div>
                          <div className="col-md-9">
                            <h5 style={{ fontSize: "20px" }}>{item.name}</h5>
                            <p style={{ fontSize: "12px", color: "gray" }}>
                              {item.info}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <LikedByCard restaurantId={restaurantInfo["id"]} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (
    Object.keys(restaurantInfo).length === 0 ||
    Object.keys(userInfo).length === 0
  ) {
    return <></>;
  } else {
    if (userInfo["id"] === restaurantInfo["owner"]) {
      return <RenderRestaurantPage ownerStatus={true} />;
    } else {
      return <RenderRestaurantPage ownerStatus={false} />;
    }
  }
};

export default RestaurantPage;

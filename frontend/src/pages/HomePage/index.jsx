import { Toast, ToastContainer } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useContext, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { BlogPostCard, ComposePost, SideCard } from "../../components";
import "./style.css";
import { AuthContext } from "../../contexts/AuthContext";

const HomePage = () => {
  const { authToken } = useContext(AuthContext);
  const [userNotificatons, setUserNotificatons] = useOutletContext();
  const [blogData, setBlogData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState(false);
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);

  const getUserFeed = (page) => {
    fetch(`http://127.0.0.1:8000/network/user/feed/?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          data["results"].map((item, index) =>
            setBlogData((state) => [...state, item])
          );
          setHasMore(data["next"] !== null);
        });
      } else {
        //
      }
    });
  };

  var similarRestaurants = [
    {
      link: 1,
      name: "Alo",
      info: "163 Spadina Ave M5V2L6 ∙ 416-260-2222",
      image:
        "https://3di6zv3beqwj3om56f47wlza-wpengine.netdna-ssl.com/wp-content/uploads/2020/06/Alo_Canap%C3%A9s_2020_00_1024.jpg",
    },
    {
      link: 9,
      name: "Shokunin",
      info: "2016 4 St SW T2S1W3 ∙ 403-229-3444",
      image:
        "https://3di6zv3beqwj3om56f47wlza-wpengine.netdna-ssl.com/wp-content/uploads/2020/06/St._Lawrence_2020_00a_1024.jpg",
    },
    {
      link: 3,
      name: "Joe Beef",
      info: "2491 Notre-Dame H3J1N6 ∙ 514-935-6504",
      image:
        "https://3di6zv3beqwj3om56f47wlza-wpengine.netdna-ssl.com/wp-content/uploads/2020/06/Joe_Beef_2020_00_1024.jpg",
    },
  ];

  const getRestaurantInfo = async () => {
    await fetch(`http://127.0.0.1:8000/restaurant/update/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then(() => {
          setRestaurantStatus(true);
        });
      } else {
        //
      }
    });
  };

  useEffect(() => {
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
    getRestaurantInfo();
    getUserNotifications();
    getUserFeed(1);
  }, [authToken]);

  return (
    <>
      <div className="body">
        <div className="container px-4">
          <div className="row">
            <div className="col" style={{ marginLeft: "100px" }}>
              {restaurantStatus && (
                <>
                  <div className="px-3">
                    <div className="card" style={{ width: "680px" }}>
                      <div className="card-body">
                        <ComposePost setToast={toggleShowA} />
                      </div>
                    </div>
                  </div>
                  <hr style={{ width: "680px", marginLeft: "35px" }} />
                </>
              )}
              <div style={{ width: "680px", marginLeft: "35px" }} />
              <InfiniteScroll
                pageStart={1}
                loadMore={getUserFeed}
                hasMore={hasMore}
                loader={
                  <div className="loader" key={0}>
                    Loading ...
                  </div>
                }
              >
                {blogData.map((item, index) => (
                  <BlogPostCard key={index} blogData={item} />
                ))}
              </InfiniteScroll>
            </div>

            <div className="col sticky">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title pb-2">Most Followed Restaurants</h5>
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
              <SideCard
                title="Most Popular Posts"
                blogs={[
                  {
                    date: "Jan 1. 2022 ∙ 15 min read",
                    title: "Ultimate Guide to Restaurant Marketing",
                  },
                  {
                    date: "Jan 5. 2022 ∙ 15 min read",
                    title: "The Ultimate Guide to Creating a Website for Your Restaurant",
                  },
                  {
                    date: "Feb 10. 2022 ∙ 15 min read",
                    title: "Kitchen Secrets",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <ToastContainer className="p-3 position-fixed" position="bottom-start">
          <Toast
            bg="success"
            delay={3000}
            show={showA}
            onClose={toggleShowA}
            autohide
          >
            <Toast.Body className="text-white">
              Added new blog succesfully
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </>
  );
};

export default HomePage;

import ReactPaginate from "react-paginate";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import "./style.css";

const RestaurantCommentsCard = ({ restaurantId }) => {
  const { authToken } = useContext(AuthContext);
  const [userComments, setUserComments] = useState([]);
  const { register, reset, handleSubmit } = useForm();
  const [pageCount, setPageCount] = useState(0);

  const formatDate = (dateObj) => {
    let month = dateObj.toLocaleString("default", { month: "long" });
    let date = dateObj.getDate();
    let year = dateObj.getFullYear();

    return `${month} ${date}, ${year}`;
  };

  const getRestaurantComments = async (page) => {
    return await fetch(
      `http://127.0.0.1:8000/network/restaurant/comments/${restaurantId}/?page=${page}`,
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

  const handlePageClick = (data) => {
    let currentPage = data.selected + 1;
    getRestaurantComments(currentPage).then((data) => {
      setPageCount(Math.ceil(data["count"] / 5));
      setUserComments(data["results"]);
    });
  };

  const addRestaurantComments = async (data, e) => {
    e.target.reset();
    await fetch(
      `http://127.0.0.1:8000/network/comment/restaurant/${restaurantId}/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      }
    ).then((response) => {
      if (response.status === 200) {
        response.json().then(() => {
          getRestaurantComments(1).then((data) => {
            setPageCount(Math.ceil(data["count"] / 5));
            setUserComments(data["results"]);
          });
        });
      } else {
        //
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    getRestaurantComments(1).then((data) => {
      if (isMounted) {
        setPageCount(Math.ceil(data["count"] / 5));
        setUserComments(data["results"]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="px-3">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Recent comments</h4>
              </div>
              <div className="comment-widgets m-b-20 p-3">
                {userComments.map((item, index) => (
                  <div key={index} className="d-flex flex-row comment-row">
                    <div className="p-2">
                      <span className="round">
                        <img
                          className="mr-3 rounded-circle commentPicture"
                          src={
                            item["user"].avatar ??
                            "https://wretched.org/wp-content/uploads/2017/09/Anon-profile.png"
                          }
                          alt="user"
                          width="50"
                        />
                      </span>
                    </div>
                    <div className="w-19">
                      <h5>
                        {item["user"].first_name + " " + item["user"].last_name}
                      </h5>
                      <div className="comment-text comment-footer">
                        <span className="date">
                          {formatDate(new Date(Date.parse(item.created_at)))}
                        </span>
                      </div>
                      <p className="m-b-5 m-t-10">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <ReactPaginate
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
              <div className="bg-light p-3">
                <form onSubmit={handleSubmit(addRestaurantComments)}>
                  <div className="form-group">
                    <label className="p-2" htmlFor="comment">
                      Your Comment
                    </label>
                    <textarea
                      name="comment"
                      className="form-control"
                      rows="3"
                      {...register("comment")}
                    />
                  </div>
                  <button type="submit" className="mt-3 btn btn-primary">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantCommentsCard;

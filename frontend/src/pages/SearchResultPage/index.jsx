import InfiniteScroll from "react-infinite-scroller";
import { SearchResultCard } from "../../components";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import "./style.css";
import { AuthContext } from "../../contexts/AuthContext";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const { authToken } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [userNotificatons, setUserNotificatons] = useOutletContext();
  const [hasMore, setHasMore] = useState(false);

  const getSearchResults = (page) => {
    fetch(
      `http://127.0.0.1:8000/network/search/restaurant/?search=${searchParams.get(
        "search_query"
      )}&page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          data["results"].map((item, index) =>
            setSearchResults((state) => [...state, item])
          );
          setHasMore(data["next"] !== null);
        });
      } else {
        //
      }
    });
  };

  const formatNumber = (number) => {
    number = number.substring(2);
    return (
      number.slice(0, 3) + "-" + number.slice(3, 6) + "-" + number.slice(6)
    );
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
    getUserNotifications();
    getSearchResults(1);
  }, [authToken, searchParams]);

  return (
    <>
      <div className="body">
        <div className="container">
          <div className="row card-width">
            <a>
              <div className="card">
                <div className="card-body">
                  Search results for: {searchParams.get("search_query")}
                </div>
              </div>
            </a>
            <InfiniteScroll
              pageStart={1}
              loadMore={getSearchResults}
              hasMore={hasMore}
              loader={
                <div className="loader" key={0}>
                  Loading ...
                </div>
              }
            >
              {searchResults.map((item, index) => (
                <SearchResultCard
                  restaurantId={item["id"]}
                  key={index}
                  image={
                    item["logo"] ??
                    "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png"
                  }
                  title={item["name"]}
                  location={`${item["address"]} ∙ ${formatNumber(
                    item["phone_number"]
                  )}`}
                  desc={item["desc"]}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResultPage;

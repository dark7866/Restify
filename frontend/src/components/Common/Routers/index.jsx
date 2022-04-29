import { useLayoutEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  BlogPostPage,
  HomePage,
  LandingPage,
  ProfilePage,
  RestaurantPage,
  SearchResultPage,
} from "../../../pages";
import CreateRestaurant from "../../../pages/CreateRestaurant";
import Navbar from "../Navbar";

const PageRouter = () => {
  const { authToken } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {authToken ? (
        <Routes>
          <Route exact path="/" element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="restaurant/create-restaurant"
              element={<CreateRestaurant />}
            />
            <Route
              path="restaurant/:restaurantId"
              element={<RestaurantPage />}
            />
            <Route path="blog/:blogId" element={<BlogPostPage />} />
            <Route path="search" element={<SearchResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default PageRouter;

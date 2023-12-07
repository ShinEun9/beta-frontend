import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "@/pages/Error/ErrorPage";
import MainPage from "@/pages/Main/MainPage";
import DetailPage from "@/pages/Detail/DetailPage";
import { Info, Review } from "@/components/detail";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    errorElement: <ErrorPage />,
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/detail/:id",
        element: <DetailPage />,
        children: [
          {
            path: "info",
            element: <Info />,
          },
          {
            path: "review",
            element: <Review />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);

export default router;

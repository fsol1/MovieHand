import BottomBar from "./components/BottomBar";
import Explore from "./components/Explore";
import HandPage from "./components/HandPage";
import Header from "./components/Header";
import LogIn from "./components/LogIn";
import Main from "./components/Main";
import NewHand from "./components/NewHand";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import UpdateProfile from "./components/UpdateProfile";
import axios from "axios";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return window.localStorage.getItem("movie.auth") !== null;
  });

  const logIn = async (username, password) => {
    const url = "http://localhost:8009/api/log_in/";
    try {
      const response = await axios.post(url, { username, password });
      window.localStorage.setItem("movie.auth", JSON.stringify(response.data));
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = () => {
    window.localStorage.removeItem("movie.auth");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} logOut={logOut} />
      <Routes>
        <Route path="/" element={<Main isLoggedIn={isLoggedIn} />} />
        <Route
          path="/log-in"
          element={<LogIn logIn={logIn} isLoggedIn={isLoggedIn} />}
        />
        <Route path="/sign-up" element={<SignUp isLoggedIn={isLoggedIn} />} />
        <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} />} />
        <Route
          path="profile/:id"
          element={<Profile isLoggedIn={isLoggedIn} />}
        />
        <Route path="/explore" element={<Explore isLoggedIn={isLoggedIn} />} />
        <Route path="/newhand" element={<NewHand isLoggedIn={isLoggedIn} />} />
        <Route path="hand/:id" element={<HandPage isLoggedIn={isLoggedIn} />} />
        <Route
          path="/update"
          element={<UpdateProfile isLoggedIn={isLoggedIn} />}
        />
      </Routes>
      <BottomBar isLoggedIn={isLoggedIn} />
    </BrowserRouter>
  );
}

export default App;

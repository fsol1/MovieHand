import { getUser } from "../services/AuthService";
import { getProfile } from "../services/MovieService";
import React, { useEffect, useState } from "react";
import { FaHome, FaCompass, FaPlus, FaUserAlt } from "react-icons/fa";

const Header = (props) => {
  const [profile, setProfile] = useState([]);
  const user = getUser();

  useEffect(() => {
    if (props.isLoggedIn) {
      getProfile(user.id, setProfile);
    }
  }, [props.isLoggedIn]);

  return (
    <div class="fixed z-20 flex h-20 w-full items-center justify-between bg-bgb font-body text-bwh drop-shadow-2xl">
      <div>
        <h1 class="ml-5 font-body text-2xl font-bold tracking-wide hover:text-bg2">
          MovieHand
        </h1>
      </div>
      <div class="invisible ml-8 flex w-[550px] justify-between lg:visible ">
        <a
          href="/"
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaHome />
          </div>
          <span class="pt-1 text-xs">Home</span>
        </a>
        <a
          href="/explore"
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaCompass />
          </div>
          <span class="pt-1 text-xs">Explore</span>
        </a>
        <a
          href={props.isLoggedIn ? "/newhand" : "/log-in"}
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaPlus />
          </div>
          <span class="pt-1 text-xs">New Hand</span>
        </a>
        <a
          href={props.isLoggedIn ? "/profile" : "/log-in"}
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaUserAlt />
          </div>
          <span class="pt-1 text-xs">Account</span>
        </a>
      </div>
      <div class="flex items-center">
        {props.isLoggedIn ? (
          <div class="mr-3 flex w-28 rounded-2xl bg-bg1 px-5 py-1 hover:bg-bg2">
            <a href="/">
              <button
                type="button"
                data-cy="logOut"
                class="pl-2"
                onClick={() => props.logOut()}
              >
                Log out
              </button>
            </a>
          </div>
        ) : (
          <div class="mr-3 flex w-28 rounded-2xl bg-bg1 px-5 py-1 hover:bg-bg2">
            <a href="/log-in">
              <button type="button" class="pl-3">
                Log in
              </button>
            </a>
          </div>
        )}
        <a href={props.isLoggedIn ? "/profile" : "/log-in"}>
          <div class="mr-5 flex h-12 w-12 items-center overflow-hidden rounded-full bg-bg1 ">
            <div class="mx-auto text-bg2">
              {props.isLoggedIn ? (
                <img src={profile.photo} alt="" />
              ) : (
                <FaUserAlt />
              )}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Header;

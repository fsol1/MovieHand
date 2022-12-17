import { getUser } from "../services/AuthService";
import { getProfile } from "../services/MovieService";
import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";

const ProfileBar = (props) => {
  const [profile, setProfile] = useState([]);

  const user = getUser();

  useEffect(() => {
    getProfile(props.profile.id, setProfile);
  }, []);

  return (
    <div class="mt-5 flex h-16 w-[350px] items-center rounded-2xl bg-bg1 font-body md:w-[400px]">
      <div class="ml-5 flex h-12 w-12 items-center overflow-hidden rounded-full border border-bg2 bg-bg1">
        <a href={user.id == profile.id ? "/profile" : "/profile/" + profile.id}>
          <div class="mx-auto text-bg2">
            {typeof profile.photo !== "undefined" ? (
              <img src={profile.photo} alt="" />
            ) : (
              <FaUserAlt />
            )}
          </div>
        </a>
      </div>
      <a href={user.id == profile.id ? "/profile" : "/profile/" + profile.id}>
        <h1 class="pl-4 font-bold">{profile.username}</h1>
      </a>
    </div>
  );
};

export default ProfileBar;

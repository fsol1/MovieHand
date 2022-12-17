import { getUser } from "../services/AuthService";
import { getProfile } from "../services/MovieService";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Comment = ({ comment }) => {
  const [profile, setProfile] = useState([]);

  const user = getUser();
  const timeago = moment(comment.created_date).fromNow();

  useEffect(() => {
    getProfile(comment.author, setProfile);
  }, []);

  return (
    <div class="mt-3 rounded-2xl bg-bg1 p-4 font-body">
      <div class="flex justify-between">
        <div class="flex">
          <a
            href={user.id == profile.id ? "/profile" : "/profile/" + profile.id}
          >
            <div class="flex items-center">
              <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bg2">
                <img src={profile.photo} alt="" />
              </div>
              <h1 class="ml-2 font-bold">{profile.username}</h1>
            </div>
          </a>
        </div>
        <h1 class="text-sm">{timeago}</h1>
      </div>
      <h1>{comment.body}</h1>
    </div>
  );
};

export default Comment;

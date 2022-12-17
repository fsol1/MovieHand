import "../cards.scss";
import { getUser } from "../services/AuthService";
import {
  likeHand,
  dislikeHand,
  getHandLiked,
  getProfile,
  getLikesCount,
  getCommentsCount,
  getCovers,
} from "../services/MovieService";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";

const Hand = ({ hand, isLoggedIn }) => {
  const [covers, setCovers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const user = getUser();
  const cards = [];
  const bcards = [];
  const timeago = moment(hand.created_date).fromNow();

  useEffect(() => {
    const getData = async () => {
      await getCovers(hand.movies, setCovers);
      await getProfile(hand.author, setProfile);
      await getHandLiked(hand.id, setIsLiked);
      await getCommentsCount(hand.id, setComments);
      await getLikesCount(hand.id, setLikes).then(setLoading(false));
    };

    getData();
  }, []);

  for (let i = 0; i < 5; i++) {
    cards.push(
      <div
        class="card hover:z-10 hover:drop-shadow-2xl"
        style={{
          backgroundImage: `url(${
            "https://image.tmdb.org/t/p/original" + covers[i]
          })`,
        }}
      ></div>
    );
    bcards.push(
      <div
        class="bcard opacity-75"
        style={{
          backgroundImage: `url(${
            "https://image.tmdb.org/t/p/original" + covers[i]
          })`,
        }}
      ></div>
    );
  }

  if (isLoading) {
    return (
      <div class="group mt-5 w-[460px] animate-pulse overflow-hidden rounded-2xl bg-bg1 md:w-[500px]">
        <div class="flex w-full justify-center p-3">
          <div class="flex items-center">
            <span class="font-body text-xl"></span>
          </div>
        </div>
        <div class="relative h-80 w-full overflow-hidden">
          <div class="cards blur-xl group-hover:animate-pulse"></div>
          <div class="cards"></div>
        </div>
        <div class="flex w-full justify-between p-3">
          <div class="flex items-center">
            <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bg2"></div>
            <span class="ml-2 text-sm font-bold"></span>
          </div>
          <div class="mt-1 flex items-center text-xl text-bwh">
            <span class="mr-2 hover:text-re">
              <FaRegHeart />
            </span>
            <span class="hover:text-bg2">
              <FaRegComment />
            </span>
          </div>
        </div>
        <div class="px-3 pb-2">
          <div class="pt-1">
            <div class="mb-2 text-ellipsis text-sm">
              <span class="font-bold"></span> Likes ·{" "}
              <span class="font-bold"></span> comments
            </div>
            <div class="mb-2 h-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      class="group mt-5 w-[460px] overflow-hidden rounded-2xl bg-bg1 text-bwh md:w-[500px]"
      id={"hand-" + hand.id}
    >
      <a href={"/hand/" + hand.id} id="title">
        <div class="flex w-full justify-center p-3">
          <div class="flex items-center">
            <span class="font-body text-xl hover:text-bg2">{hand.title}</span>
          </div>
        </div>
      </a>
      <div class="relative h-80 w-full overflow-hidden">
        <div class="cards blur-xl group-hover:animate-pulse">{bcards}</div>
        <div class="cards">{cards}</div>
      </div>
      <div class="flex w-full justify-between p-3">
        <a
          href={user.id == profile.id ? "/profile" : "/profile/" + profile.id}
          id="profile"
        >
          <div class="flex items-center">
            <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bg2">
              <img src={profile.photo} alt="" />
            </div>
            <span class="ml-2 text-sm font-bold">{profile.username}</span>
          </div>
        </a>

        <div class="mt-1 flex items-center text-xl text-bwh">
          {!isLiked ? (
            <span
              class="mr-2 cursor-pointer hover:text-re"
              onClick={() => {
                if (isLoggedIn) {
                  likeHand(hand.id).then(() => {
                    setIsLiked(true);
                    setLikes(likes + 1);
                  });
                }
              }}
            >
              <FaRegHeart />
            </span>
          ) : (
            <span
              class="mr-2 cursor-pointer text-re"
              onClick={() =>
                dislikeHand(hand.id).then(() => {
                  setIsLiked(false);
                  setLikes(likes - 1);
                })
              }
            >
              <FaHeart />
            </span>
          )}
          <span class="cursor-pointer hover:text-bg2">
            <FaRegComment />
          </span>
        </div>
      </div>
      <a href={"/hand/" + hand.id}>
        <div class="px-3 pb-2">
          <div class="pt-1">
            <div class="flex justify-between">
              <div class="mb-2 text-ellipsis text-sm">
                <span class="font-bold">{likes}</span> Likes ·{" "}
                <span class="font-bold">{comments}</span> Comments
              </div>
              <span class="text-sm">{timeago}</span>
            </div>
            <div class="mb-2 h-auto">{hand.description}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Hand;

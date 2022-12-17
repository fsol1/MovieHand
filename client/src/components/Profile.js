import { getUser } from "../services/AuthService";
import {
  getProfile,
  getFollows,
  getFollowers,
  getHandsByUser,
  getHandsByLikes,
  getHandsCount,
  getCovers,
  getUserFollowed,
  unfollowUser,
  followUser,
} from "../services/MovieService";
import Hand from "./Hand";
import React, { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaArrowLeft, FaUserAlt, FaPlus, FaCheck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const Profile = (props) => {
  const [isMore, setMore] = useState(false);
  const [isSwitch, setSwitch] = useState(false);
  const [cover, setCover] = useState([]);
  const [hands, setHands] = useState([]);
  const [handsCount, setHandsCount] = useState(0);
  const [follows, setFollows] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const [profile, setProfile] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  let Id = 0;

  if (props.isLoggedIn && typeof id == "undefined") {
    Id = getUser().id;
  } else {
    Id = id;
  }

  useEffect(() => {
    const getData = async (id) => {
      await getProfile(id, setProfile);
      await getHandsCount(id, setHandsCount);
      await getFollows(id, setFollows);
      await getFollowers(id, setFollowers);
      if (props.isLoggedIn && typeof id !== "undefined") {
        await getUserFollowed(Id, setIsFollowed);
      }
    };

    getData(Id);

    if (!isSwitch) {
      getHandsByUser(Id, setHands);
    } else {
      getHandsByLikes(Id, setHands);
    }
  }, [isSwitch, isFollowed]);

  useEffect(() => {
    getCovers([profile.favorite_movie], setCover);
  }, [profile]);

  return (
    <div class="h-screen w-full justify-center bg-bgb pt-20 pb-16 text-bwh">
      <div class="flex flex-col items-center justify-center bg-bgb pb-16">
        <div
          style={{
            backgroundImage: `url(https://www.themoviedb.org/t/p/w1280${cover})`,
          }}
          class="w-full bg-cover bg-center"
        >
          <div class="bg-gradient-to-b from-transparent to-bgb backdrop-blur">
            <div class="flex w-full justify-between px-5 pt-5">
              <button
                class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bg1"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
              </button>
              {props.isLoggedIn && typeof id == "undefined" && (
                <button
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bg1 text-xl"
                  onClick={() => navigate("/update")}
                >
                  <BsThreeDots />
                </button>
              )}
              {props.isLoggedIn && typeof id !== "undefined" && !isFollowed && (
                <button
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bg1 text-xl"
                  onClick={() => {
                    followUser(Id).then(setIsFollowed(true));
                  }}
                >
                  <FaPlus />
                </button>
              )}
              {props.isLoggedIn && typeof id !== "undefined" && isFollowed && (
                <button
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bwh text-xl text-bg1"
                  onClick={() => {
                    unfollowUser(Id).then(setIsFollowed(false));
                  }}
                >
                  <FaCheck />
                </button>
              )}
            </div>
            <div class="flex flex-col items-center">
              <div class="mt-16 flex h-28 w-28 items-center overflow-hidden rounded-full border border-bg2 bg-bg1 md:h-32 md:w-32">
                <div class="mx-auto text-bg2">
                  {typeof profile.photo !== "undefined" ? (
                    <img src={profile.photo} alt="" />
                  ) : (
                    <FaUserAlt class="text-2xl" />
                  )}
                </div>
              </div>
              <h1 class="pt-5 font-body text-xl font-bold">
                {profile.username}
              </h1>
              <div>
                <p
                  class={
                    !isMore
                      ? "w-full truncate pt-2 font-body"
                      : "h-36 w-full overflow-scroll pt-2 font-body"
                  }
                >
                  {profile.description}
                </p>
              </div>
              <button
                class="font-body hover:text-bg2"
                onClick={() => setMore(!isMore)}
              >
                {!isMore ? "more" : "less"}
              </button>
            </div>
          </div>
        </div>
        <div class="mt-5 flex h-16 w-[325px] items-center justify-evenly rounded-2xl border border-bg2 bg-bg1 md:w-[360px]">
          <div class="flex w-10 flex-col items-center font-body">
            <h1 class="text-xl">{handsCount}</h1>
            <h1>Hands</h1>
          </div>
          <div class="flex w-10 flex-col items-center font-body">
            <h1 class="text-xl">{followers}</h1>
            <h1>Followers</h1>
          </div>
          <div class="flex w-10 flex-col items-center font-body">
            <h1 class="text-xl">{follows}</h1>
            <h1>Following</h1>
          </div>
        </div>
        <div class="mt-8 flex h-10 w-[370px] items-center justify-center rounded-2xl bg-bg1 md:w-[390px]">
          <button
            class={
              !isSwitch
                ? "ml-2 h-7 w-full rounded-2xl bg-bg2 shadow-xl"
                : "ml-2 h-7 w-full rounded-2xl"
            }
            onClick={() => setSwitch(false)}
          >
            Hands
          </button>
          <button
            class={
              isSwitch
                ? "mr-2 h-7 w-full rounded-2xl bg-bg2 shadow-xl"
                : "mr-2 h-7 w-full rounded-2xl"
            }
            onClick={() => setSwitch(true)}
          >
            Likes
          </button>
        </div>
        {hands.length > 0 ? (
          hands.map((hand) => {
            return (
              <Hand hand={hand} isLoggedIn={props.isLoggedIn} key={hand.id} />
            );
          })
        ) : (
          <div class="pt-10 font-body">No hands :'(</div>
        )}
      </div>
    </div>
  );
};

export default Profile;

import "../cards.scss";
import {
  likeHand,
  dislikeHand,
  getHandLiked,
  getProfile,
  getLikesCount,
  getCommentsCount,
  getCovers,
  getHand,
  getComments,
  commentHand,
} from "../services/MovieService";
import Comment from "./Comment";
import { Formik, Form, Field } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const HandPage = (props) => {
  const [hand, setHand] = useState([]);
  const [covers, setCovers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const cards = [];
  const bcards = [];
  const timeago = moment(hand.created_date).fromNow();

  const onSubmit = async (values, actions) => {
    try {
      await commentHand(hand.id, values.body);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      await getCovers(hand.movies, setCovers);
      await getProfile(hand.author, setProfile);
      await getHandLiked(hand.id, setIsLiked);
      await getCommentsCount(hand.id, setCommentsCount);
      await getComments(hand.id, setComments);
      await getLikesCount(hand.id, setLikes).then(setLoading(false));
    };

    getHand(id, setHand);
    if (typeof hand.id !== "undefined") {
      getData();
    }
  }, [hand.id]);

  for (let i = 0; i < 5; i++) {
    cards.push(
      <div
        class="bcard hover:z-10 hover:drop-shadow-2xl"
        style={{
          backgroundImage: `url(${
            "https://image.tmdb.org/t/p/original" + covers[i]
          })`,
        }}
      ></div>
    );
    bcards.push(
      <div
        class="bbcard opacity-75"
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
      <div class="h-screen w-full overflow-auto bg-bgb pt-20 pb-16 text-bwh">
        <div class="flex w-full  justify-between px-5 pt-1">
          <button class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bg1">
            <FaArrowLeft />
          </button>
        </div>
        <div class="group relative flex h-3/4 w-full animate-pulse flex-col pt-5">
          <div class="mx-auto font-body text-2xl text-white"></div>
          <div class="mt-10 h-20 w-full bg-gradient-to-b from-transparent to-bgb"></div>
        </div>

        <div class="flex w-full animate-pulse justify-between px-10 md:px-32 lg:px-96">
          <div class="flex items-center">
            <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bg2"></div>
            <span class="ml-2 text-sm font-bold"></span>
          </div>

          <div class="mt-1 flex items-center text-xl text-bwh">
            <span class="mr-2 cursor-pointer">
              <FaRegHeart />
            </span>

            <span class="cursor-pointer hover:text-bg2">
              <FaRegComment />
            </span>
          </div>
        </div>
        <div class="flex animate-pulse flex-col px-10 pt-5 pb-2 md:px-32 lg:px-96">
          <div class="pt-1">
            <div class="flex justify-between">
              <div class="mb-2 text-ellipsis text-sm">
                <span class="font-bold"></span> Likes ·{" "}
                <span class="font-bold"></span> Comments
              </div>
              <span class="text-sm"></span>
            </div>
            <div class="mb-2 h-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="h-screen w-full overflow-auto bg-bgb pt-20 pb-16 text-bwh">
      <div class="flex w-full justify-between px-5 pt-5">
        <button
          class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bg1"
          onClick={() => navigate(-1)}
          data-cy="return"
        >
          <FaArrowLeft />
        </button>
      </div>
      <div class="group relative flex h-3/4 w-full flex-col pt-5">
        <h1
          class="mx-auto -mt-8 pb-3 font-body text-2xl text-white"
          data-testid="title"
        >
          {hand.title}
        </h1>
        <div class="-mt-14 flex h-full w-full">
          <div class="cards blur-xl group-hover:animate-pulse">{bcards}</div>
          <div class="cards" data-testid="cards">
            {cards}
          </div>
        </div>
      </div>

      <div
        class="-mt-5 flex w-full justify-between px-10 md:px-32 lg:px-96"
        data-testid="profile"
      >
        <div class="flex items-center">
          <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-bg2">
            <img src={profile.photo} alt="" />
          </div>
          <span class="ml-2 text-sm font-bold">{profile.username}</span>
        </div>

        <div class="mt-1 flex items-center text-xl text-bwh" data-testid="like">
          {!isLiked ? (
            <span
              class="mr-2 cursor-pointer hover:text-re"
              onClick={() => {
                if (props.isLoggedIn) {
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
      <div class="flex flex-col px-10 pt-5 pb-2 md:px-32 lg:px-96">
        <div class="pt-1">
          <div class="flex justify-between">
            <div class="mb-2 text-ellipsis text-sm">
              <span class="font-bold" data-testid="likes">
                {likes}
              </span>{" "}
              Likes ·{" "}
              <span class="font-bold" data-testid="comments">
                {commentsCount}
              </span>{" "}
              Comments
            </div>
            <span class="text-sm">{timeago}</span>
          </div>
          <div class="mb-2 h-auto">{hand.description}</div>
        </div>
        {props.isLoggedIn ? (
          <Formik initialValues={{ body: "" }} onSubmit={onSubmit}>
            {({ isSubmitting }) => {
              return (
                <Form class="mt-5 flex w-full flex-col self-center rounded-2xl bg-bg1 p-4 font-body">
                  <label class="mb-3 flex w-80 flex-col md:h-36">
                    Add a new comment:{" "}
                    <Field
                      name="body"
                      as="textarea"
                      data-testid="body"
                      class="h-20 w-full rounded-lg border border-bg2 bg-bg1 px-3 py-2 leading-tight md:h-32"
                    />
                  </label>
                  <button
                    type="submit"
                    class=" w-28 self-end rounded-2xl bg-bgb p-2 hover:bg-bg2"
                    disabled={isSubmitting}
                  >
                    Comment
                  </button>
                </Form>
              );
            }}
          </Formik>
        ) : null}
        <div class="w-full self-center pt-5">
          {comments.map((comment) => (
            <Comment comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandPage;

import { getAccessToken, getUser } from "./AuthService";
import axios from "axios";

const API_URL = "http://localhost:8009/api/";
const API_KEY = "yourkey";

export const getProfile = async (profileId, setProfile) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}profiles/${profileId}/`,
    });
    setProfile(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandLiked = async (handId, setIsLiked) => {
  const user = getUser();
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}likes/is_hand_liked_by_user/?handid=${handId}&userid=${user.id}`,
    });
    setIsLiked(response.data.liked);
  } catch (error) {
    return { error: error.message };
  }
};

export const getUserFollowed = async (user1, setIsFollowed) => {
  const user = getUser();
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}follows/is_user_followed_by_user/?user1id=${user.id}&user2id=${user1}`,
    });
    setIsFollowed(response.data.followed);
  } catch (error) {
    return { error: error.message };
  }
};

export const getFollowId = async (user1) => {
  const user = getUser();
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}follows/is_user_followed_by_user/?user1id=${user.id}&user2id=${user1}`,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const getLikeId = async (handId) => {
  const user = getUser();
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}likes/is_hand_liked_by_user/?handid=${handId}&userid=${user.id}`,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const unfollowUser = async (userId) => {
  const followId = (await getFollowId(userId)).data.id;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios({
      method: "delete",
      url: `${API_URL}follows/${followId}/`,
      headers,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const followUser = async (userId) => {
  const user = getUser();
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const data = {
    author: user.id,
    followed: userId,
  };
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}follows/`,
      headers,
      data,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const likeHand = async (handId) => {
  const user = getUser();
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const data = {
    author: user.id,
    hand: handId,
  };
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}likes/`,
      headers,
      data,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const commentHand = async (handId, text) => {
  const user = getUser();
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const data = {
    author: user.id,
    hand: handId,
    body: text,
  };
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}comments/`,
      headers,
      data,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const dislikeHand = async (handId) => {
  const likeId = (await getLikeId(handId)).data.id;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios({
      method: "delete",
      url: `${API_URL}likes/${likeId}/`,
      headers,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const getRecentHands = async (setHands) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_recent_hands/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsByFollows = async (setHands) => {
  const user = getUser();
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_hands_by_user_follows/${user.id}/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsByUserLikes = async (setHands) => {
  const user = getUser();
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_hands_by_user_likes/${user.id}/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getLikesCount = async (handId, setLikesCount) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}likes/get_hand_likes_count/${handId}/`,
    });
    setLikesCount(response.data.likes);
  } catch (error) {
    return { error: error.message };
  }
};

export const getCommentsCount = async (handId, setComments) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}comments/get_hand_comments_count/${handId}/`,
    });
    setComments(response.data.comments);
  } catch (error) {
    return { error: error.message };
  }
};

export const getMovies = async (text, setMovies) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
          query: text,
          page: 1,
          include_adult: false,
        },
      }
    );
    setMovies(response.data.results.slice(0, 10));
  } catch (error) {
    return { error: error.message };
  }
};

export const getUsers = async (text, setUsers) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}profiles/get_profiles_by_username/${text}/`,
    });
    setUsers(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsByTitle = async (text, setHands) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_hands_by_title/${text}/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsByTag = async (text, setHands) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_hands_by_tag/${text}/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getFollows = async (userId, setFollows) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}follows/get_user_follows_count/${userId}/`,
    });
    setFollows(response.data.follows);
  } catch (error) {
    return { error: error.message };
  }
};

export const getFollowers = async (userId, setFollowers) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}follows/get_user_followers_count/${userId}/`,
    });
    setFollowers(response.data.followers);
  } catch (error) {
    return { error: error.message };
  }
};

export const addHand = async (hand, movies) => {
  const user = getUser();
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const data = {
    author: user.id,
    title: hand.title,
    description: hand.description,
    movies: movies,
    tags: hand.tags.split(",").slice(0, 5),
  };
  try {
    const response = await axios({
      method: "post",
      url: `${API_URL}hands/`,
      headers,
      data,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const updateProfile = async (values, favorite_movie, photo) => {
  const user = getUser();
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const data = {
    photo: photo,
    description: values.description,
    favorite_movie: favorite_movie,
  };
  try {
    const response = await axios({
      method: "put",
      url: `${API_URL}profiles/${user.id}/`,
      headers,
      data,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const getHand = async (handId, setHand) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/${handId}/`,
    });
    setHand(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsCount = async (userId, setHands) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_user_hands_count/${userId}/`,
    });
    setHands(response.data.hands);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsByUser = async (userId, setHands) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_hands_by_user/${userId}/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getHandsByLikes = async (userId, setHands) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}hands/get_hands_by_likes/${userId}/`,
    });
    setHands(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getComments = async (handId, setComments) => {
  try {
    const response = await axios({
      method: "get",
      url: `${API_URL}comments/get_hand_comments/${handId}/`,
    });
    setComments(response.data);
  } catch (error) {
    return { error: error.message };
  }
};

export const getCovers = async (idsToGet, setCovers) => {
  try {
    const data = await Promise.all(
      idsToGet.map((id) =>
        axios({
          method: "get",
          url: `https://api.themoviedb.org/3/movie/${id}`,
          params: { api_key: API_KEY },
        })
      )
    );
    const responseData = data.map((response) => response.data.poster_path);
    setCovers(responseData);
  } catch (error) {
    return { error: error.message };
  }
};

import { getAccessToken, getUser } from "../services/AuthService";
import { getMovies } from "../services/MovieService";
import Movie from "./Movie";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [movies, setMovies] = useState([]);
  const [image, setImage] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const user = getUser();

  const handleChange = async (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (searchInput.length >= 1) {
      getMovies(searchInput, setMovies);
    }
  };

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (values, actions) => {
    try {
      const token = getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };
      const url = `http://localhost:8009/api/profiles/${user.id}/`;
      const data = new FormData();
      data.append("photo", image);
      data.append("description", values.description);
      data.append("favorite_movie", movies[0].id);
      const profile = await axios({
        method: "put",
        url: url,

        data,
        headers,
      });
      if (profile.data.id) {
        navigate(`/profile`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div class="flex h-screen w-full flex-col items-center bg-bgb pt-20 pb-16 text-bwh">
      <div class="flex w-full justify-between px-5 pt-5">
        <a href="/profile">
          <button class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-bg1">
            <FaArrowLeft />
          </button>
        </a>
      </div>
      <div class="flex h-5/6 w-[360px] flex-col justify-center rounded-2xl bg-bg1 px-4 lg:w-[400px]">
        <h1 class="self-center py-5 text-xl font-bold">Update your profile</h1>
        <input class="px-14 py-3" type="file" onChange={onImageChange} />
        <div class="mx-auto mt-1 flex h-9 w-2/3 rounded-2xl border border-bwh bg-bg1">
          <input
            class="mb-1 h-8 w-full rounded-2xl bg-bg1 px-5 pr-16 text-sm focus:outline-none"
            type="text"
            name="search"
            placeholder="Search a movie"
            onChange={handleChange}
            value={searchInput}
          />
          <button class="pr-5">
            <FaSearch />
          </button>
        </div>
        {true && (
          <div class="mx-auto mb-3 h-40 w-2/3 overflow-auto">
            {movies.length >= 1 ? (
              movies.map((x) => {
                return <Movie movie={x} />;
              })
            ) : (
              <div class="pt-20 pl-20 font-body">No movies found</div>
            )}
          </div>
        )}
        <Formik initialValues={{ description: "" }} onSubmit={onSubmit}>
          {({ isSubmitting }) => {
            return (
              <Form class="flex flex-col self-center font-body">
                <label class="flex flex-col pb-5">
                  Description:
                  <Field
                    name="description"
                    as="textarea"
                    class="h-20 w-full rounded-lg border border-bg2 bg-bg1 px-3 py-2 leading-tight"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <button
                  type="submit"
                  class="mt-2 mb-3 w-32 self-center rounded-2xl bg-bgb p-3 hover:bg-bg2"
                  disabled={isSubmitting}
                >
                  Update
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProfile;

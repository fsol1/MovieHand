import { getMovies, addHand } from "../services/MovieService";
import Movie from "./Movie";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NewHand = () => {
  const [movies, setMovies] = useState([]);
  const [moviesId, setMoviesId] = useState([0, 0, 0, 0, 0]);
  const [covers, setCovers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isSubmitted, setSubmitted] = useState(false);
  const [selectedCover, setSelectedCover] = useState(0);

  const movieCovers = [];
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (searchInput.length >= 1) {
      getMovies(searchInput, setMovies);
    }
  };

  const onSubmit = async (values, actions) => {
    try {
      const hand = await addHand(values, moviesId);
      setSubmitted(true);
      if (hand.data.id) {
        navigate(`/hand/${hand.data.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  for (let i = 0; i < 5; i++) {
    movieCovers.push(
      <button
        class={
          selectedCover == i
            ? "flex h-32 w-20 rounded-2xl bg-bwh md:h-36 md:w-24"
            : "flex h-32 w-20 rounded-2xl bg-bg1 md:h-36 md:w-24"
        }
        onClick={() => {
          setSelectedCover(i);
        }}
      >
        <div
          class={
            selectedCover == i ? "mx-auto my-auto text-bg1" : "mx-auto my-auto"
          }
        >
          {moviesId[i] != 0 ? (
            <img
              class="h-24 self-center md:h-28"
              src={"https://image.tmdb.org/t/p/original" + covers[i]}
              alt=""
            />
          ) : (
            <FaPlus />
          )}
        </div>
      </button>
    );
  }

  return (
    <div class="flex h-fit w-full flex-col items-center bg-bgb pt-20 pb-16 text-bwh">
      <div class="flex h-8 w-[350px] justify-center rounded-2xl bg-bg1 md:w-[460px]">
        <input
          class="h-8 w-full rounded-2xl bg-bg1 px-5 pr-16 text-sm focus:outline-none"
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
        <div class="mb-3 h-40 w-[340px] overflow-auto md:md:w-[430px]">
          {movies.length >= 1 ? (
            movies.map((x) => {
              return (
                <Movie
                  movie={x}
                  selectedCover={selectedCover}
                  setMoviesId={setMoviesId}
                  moviesId={moviesId}
                  setCovers={setCovers}
                  covers={covers}
                />
              );
            })
          ) : (
            <div class="pt-20 pl-20 font-body text-lg md:pl-32">
              No movies found
            </div>
          )}
        </div>
      )}
      <div class="grid w-[430px] grid-cols-5 justify-center py-3 md:-ml-7 md:w-[500px] md:gap-10">
        {movieCovers}
      </div>
      <Formik
        initialValues={{ title: "", description: "", tags: "" }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form class="mt-5 flex w-[450px] flex-col items-center rounded-2xl bg-bg1 p-4 font-body md:w-[480px]">
              <label class="mb-3 flex w-80 flex-col">
                Title:{" "}
                <Field
                  type="text"
                  name="title"
                  placeholder="Ex: My favorite movies !"
                  class="h-7 rounded-lg border border-bg2 bg-bg1 px-3"
                />
              </label>
              <label class="mb-3 flex w-80 flex-col">
                Description:{" "}
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Ex: Here are some of my favorite movies."
                  class="h-20 w-full rounded-lg border border-bg2 bg-bg1 px-3 py-2 leading-tight"
                />
              </label>
              <label class="mb-3 flex w-80 flex-col">
                Tags:{" "}
                <Field
                  type="text"
                  name="tags"
                  placeholder="Ex: horror,action,adventure,favorite,scifi"
                  class="h-7 rounded-lg border border-bg2 bg-bg1 px-3"
                />
              </label>
              <button
                type="submit"
                class="mt-2 w-28 self-center rounded-2xl bg-bgb p-2 hover:bg-bg2"
                disabled={isSubmitting}
              >
                Post
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewHand;

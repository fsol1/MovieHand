import React from "react";

const Movie = (props) => {
  const onClick = () => {
    const ids = [...props.moviesId];
    const covers = [...props.covers];
    ids[props.selectedCover] = props.movie.id;
    covers[props.selectedCover] = props.movie.poster_path;
    props.setMoviesId(ids);
    props.setCovers(covers);
  };
  return (
    <div
      class="mt-3 flex h-32 w-full items-stretch rounded-2xl bg-bg1 font-body"
      onClick={onClick}
    >
      <img
        class="h-24 self-center pl-4"
        src={"https://image.tmdb.org/t/p/original" + props.movie.poster_path}
        alt=""
      />
      <div class="p-3">
        <h1 class="font-bold">{props.movie.title}</h1>
        <h1 class="text-sm">{props.movie.release_date.split("-")[0]}</h1>
      </div>
    </div>
  );
};

export default Movie;

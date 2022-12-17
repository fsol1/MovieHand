import {
  getRecentHands,
  getHandsByFollows,
  getHandsByUserLikes,
} from "../services/MovieService";
import Hand from "./Hand";
import React, { useState, useEffect } from "react";

const Main = (props) => {
  const [hands, setHands] = useState([]);
  const [recentHands, setRecentHands] = useState([]);
  const [handsByFollows, setHandsByFollows] = useState([]);
  const [handsByUserLikes, setHandsByUserLikes] = useState([]);

  useEffect(() => {
    if (props.isLoggedIn) {
      getHandsByFollows(setHandsByFollows);
      getHandsByUserLikes(setHandsByUserLikes);
    }
    getRecentHands(setRecentHands);
  }, [props.isLoggedIn]);

  useEffect(() => {
    setHands([
      ...new Set(recentHands.concat(handsByFollows, handsByUserLikes)),
    ]);
  }, [recentHands]);

  return (
    <div class="flex h-full w-full flex-col bg-bgb pt-20 pb-16 text-bwh">
      <h1 class="pl-5 pt-5 font-body text-2xl md:self-center md:pl-0">Home</h1>
      <div class="grid place-items-center pt-5">
        {hands.map((hand) => {
          return (
            <Hand hand={hand} isLoggedIn={props.isLoggedIn} key={hand.id} />
          );
        })}
      </div>
    </div>
  );
};

export default Main;

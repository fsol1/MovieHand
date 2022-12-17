import {
  getUsers,
  getHandsByTitle,
  getHandsByTag,
} from "../services/MovieService";
import Hand from "./Hand";
import ProfileBar from "./ProfileBar";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Explore = ({ isLoggedIn }) => {
  const [isSwitch, setSwitch] = useState("hands");
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [hands, setHands] = useState([]);
  const [handsByTag, sethandsByTag] = useState([]);

  const handleChange = async (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    if (searchInput.length >= 1) {
      getUsers(searchInput, setUsers);
      getHandsByTitle(searchInput, setHands);
      getHandsByTag(searchInput, sethandsByTag);
    }
  };

  return (
    <div class="flex h-screen w-full flex-col items-center bg-bgb pt-20 pb-16 text-bwh">
      <div class="mt-5 flex h-8 w-[350px] justify-center rounded-2xl bg-bg1 md:w-[460px]">
        <input
          class="h-8 w-full rounded-2xl bg-bg1 px-5 pr-16 text-sm focus:outline-none"
          type="text"
          name="search"
          placeholder="Search"
          onChange={handleChange}
          value={searchInput}
        />
        <button class="pr-5">
          <FaSearch />
        </button>
      </div>
      <div class="mt-8 flex h-7 w-[460px] items-center justify-center rounded-2xl bg-bg1 md:w-[550px]">
        <button
          class={
            isSwitch == "hands"
              ? "h-7 w-full rounded-2xl bg-bg2 shadow-xl"
              : "h-7 w-full rounded-2xl"
          }
          onClick={() => setSwitch("hands")}
        >
          Hands
        </button>
        <button
          class={
            isSwitch == "users"
              ? "h-7 w-full rounded-2xl bg-bg2 shadow-xl"
              : "h-7 w-full rounded-2xl"
          }
          onClick={() => setSwitch("users")}
        >
          Users
        </button>
        <button
          class={
            isSwitch == "tags"
              ? "h-7 w-full rounded-2xl bg-bg2 shadow-xl"
              : "h-7 w-full rounded-2xl"
          }
          onClick={() => setSwitch("tags")}
        >
          Tags
        </button>
      </div>
      {isSwitch == "hands" && searchInput.length > 0 && (
        <div class="grid w-full place-items-center bg-bgb pt-5 pb-16">
          {hands.length >= 1 ? (
            hands.map((x) => {
              return <Hand hand={x} isLoggedIn={isLoggedIn} key={x.id} />;
            })
          ) : (
            <div class="pt-20 font-body text-lg">No hands found</div>
          )}
        </div>
      )}
      {isSwitch == "users" && searchInput.length > 0 && (
        <div class="grid w-full place-items-center pt-5 pb-16">
          {users.length >= 1 ? (
            users.map((x) => {
              return <ProfileBar profile={x} key={x.id} />;
            })
          ) : (
            <div class="pt-20 font-body text-lg">No users found</div>
          )}
        </div>
      )}
      {isSwitch == "tags" && searchInput.length > 0 && (
        <div class="grid w-full place-items-center pt-5 pb-16">
          {handsByTag.length >= 1 ? (
            handsByTag.map((x) => {
              return <Hand hand={x} isLoggedIn={isLoggedIn} key={x.id} />;
            })
          ) : (
            <div class="pt-20 font-body text-lg">No hands found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;

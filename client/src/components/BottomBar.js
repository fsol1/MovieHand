import React from "react";
import { FaHome, FaCompass, FaPlus, FaUserAlt } from "react-icons/fa";

const BottomBar = (props) => {
  return (
    <div class="fixed inset-x-0 bottom-0 z-10 block h-16 w-full bg-bgb text-bwh lg:hidden">
      <div class="flex justify-between">
        <a
          href="/"
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaHome />
          </div>
          <span class="pt-1 text-xs">Home</span>
        </a>
        <a
          href="/explore"
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaCompass />
          </div>
          <span class="pt-1 text-xs">Explore</span>
        </a>
        <a
          href={props.isLoggedIn ? "/newhand" : "/log-in"}
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaPlus />
          </div>
          <span class="pt-1 text-xs">New Hand</span>
        </a>
        <a
          href={props.isLoggedIn ? "/profile" : "/log-in"}
          class="flex w-full flex-col items-center justify-center pt-3 text-center hover:text-bg2"
        >
          <div class="text-2xl">
            <FaUserAlt />
          </div>
          <span class="pt-1 text-xs">Account</span>
        </a>
      </div>
    </div>
  );
};

export default BottomBar;

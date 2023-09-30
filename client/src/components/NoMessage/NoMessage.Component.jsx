import React from "react";

import NoMessageImg from "../../assets/noMessage.png";

const NoMessage = () => {
  return (
    <div className="text-center text-xl font-semibold m-9">
      <p className="text-3xl">No Conversations or Messages Yet.</p>
      <img
        className="mx-auto animateImg mt-12 "
        src={NoMessageImg}
        alt="No conversation yet"
      />
    </div>
  );
};

export default NoMessage;

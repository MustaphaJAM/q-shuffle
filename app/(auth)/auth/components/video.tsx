import React from 'react';

const Video = () => {
  return (
    <div hidden className="fixed inset-0 w-6/12 lg:block">
      <span className="absolute bottom-6 left-6 z-10 text-sm text-white">
        ©{new Date().getFullYear()} Created with ❤️
        <a href="" target="blank" title="" className="cursor-pointer">
          {' '}
          by mustapha jamaaoui
        </a>
      </span>
      <video
        className="h-full w-full object-cover"
        loop
        autoPlay
        muted
        src="video/video.mp4"
        poster="images/back.jpg"
      ></video>
    </div>
  );
};

export default Video;

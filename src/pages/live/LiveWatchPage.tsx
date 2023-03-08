import React from "react";

interface LiveWatchPageProps {
  liveId: string;
}

const LiveWatchPage = (props: LiveWatchPageProps) => {
  return <div>Live: {props.liveId}</div>;
};

export default LiveWatchPage;

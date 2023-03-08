import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import LiveWatchPage from "../live/LiveWatchPage";
import VideoWatchPage from "../video/VideoWatchPage";
import Styled from "./WatchPage.module.scss";

const NotFoundError = (props: { errorMessage?: string }) => {
  return (
    <Box sx={{ marginLeft: 3 }}>
      <h1>Not Found</h1>
      <h3>{props.errorMessage || "コンテンツが見つかりません"}</h3>
    </Box>
  );
};

const WatchPage = () => {
  const { watchId } = useParams();
  const service = useMemo(() => {
    if (!watchId) return "unknown";
    if (/(?:sm|nm|so|ca|ax|yo|nl|ig|na|cw|z[a-e]|om|sk|yk)\d{1,14}\b/.test(watchId)) {
      return "video";
    } else if (/(?:lv)\d{1,14}\b/.test(watchId)) {
      return "live";
    }
    return "unknown";
  }, [watchId]);
  return (
    <div className={Styled.watchPage}>
      <div className={Styled.watchPageInner}>
        {service === "unknown" || !watchId ? (
          <NotFoundError />
        ) : (
          <>
            {service === "video" && <VideoWatchPage videoId={watchId} />}
            {service === "live" && <LiveWatchPage liveId={watchId} />}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchPage;

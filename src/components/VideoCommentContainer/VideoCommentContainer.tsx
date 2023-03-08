import { Box } from "@mui/system";
import React, { useState } from "react";
import VideoCommentViewer from "./VideoCommentViewer/VideoCommentViewer";
import Styled from "./VideoCommentContainer.module.scss";

interface VideoCommentContainerProps {
  thread: NvThread[];
}

const VideoCommentContainer = (props: VideoCommentContainerProps) => {
  const [threadIndex, setThreadIndex] = useState<number>(1);
  return (
    <Box>
      <div className={Styled.commentController}>
        <select value={threadIndex} onChange={(e) => setThreadIndex(parseInt(e.currentTarget.value))}>
          {props.thread.map((t, i) => (
            <option key={i} value={i}>
              {t.fork}
            </option>
          ))}
        </select>
      </div>
      <VideoCommentViewer thread={props.thread[threadIndex]} />
    </Box>
  );
};

export default VideoCommentContainer;

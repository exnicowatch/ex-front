import React, { useEffect, useRef } from "react";
import Styled from "./PlayerSlider.module.scss";

interface PlayerSliderProps {
  played: number;
  loaded: number;
  onChange: (played: number) => void;
}

const PlayerSlider = (props: PlayerSliderProps) => {
  const isDragging = useRef<boolean>(false);
  const slider = useRef<HTMLDivElement>(null);
  const handleSliderDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (slider.current) {
      isDragging.current = true;
      const rect = slider.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      props.onChange(percentage);
    }
  };
  const handleSliderMove = (e: MouseEvent) => {
    if (isDragging.current && slider.current) {
      const rect = slider.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      props.onChange(percentage);
    }
  };
  const handleSliderUp = () => {
    isDragging.current = false;
  };
  useEffect(() => {
    document.addEventListener("mousemove", handleSliderMove);
    document.addEventListener("mouseup", handleSliderUp);
    return () => {
      document.removeEventListener("mousemove", handleSliderMove);
      document.removeEventListener("mouseup", handleSliderUp);
    };
  }, []);
  return (
    <div ref={slider} className={Styled.playerSliderContainer}>
      <div className={Styled.playerSliderArea} onMouseDown={handleSliderDown}>
        <div className={Styled.playerSliderLoaded} style={{ width: `${props.loaded * 100}%` }} />
        <div className={Styled.playerSliderPlayed} style={{ width: `${props.played * 100}%` }}>
          <div className={`${Styled.playerSliderThumb} ${isDragging.current ? Styled.dragging : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSlider;

import { Theme } from "@mui/material";
import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";

import { CSSProperties, useRef } from "react";
import { useWatcherContext } from "../WatcherContext";
import Notifications from "./Notifications";
import Options from "./Options";

type ReceiverVideoProps = {};

const ReceiverVideo: React.FC<ReceiverVideoProps> = () => {
  const { canvasContainerRef, outputRef, videoRef } = useWatcherContext();
  const sx: SxProps<Theme> = {};

  const videoStyles: CSSProperties = {};

  const mainSx: SxProps<Theme> = {
    position: "relative",
    margin: 0,
  };

  const canvasStyles: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
  };

  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={sx}>
      <Box ref={mainRef} sx={mainSx}>
        <Box ref={containerRef}>
          <Box ref={canvasContainerRef} sx={{ position: "relative" }}>
            <canvas ref={outputRef} style={canvasStyles} />
            <video ref={videoRef} playsInline style={videoStyles} />
          </Box>
        </Box>
      </Box>
      <Options>
        <Notifications />
      </Options>
    </Box>
  );
};

export default ReceiverVideo;

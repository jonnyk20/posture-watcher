import Card from "@mui/material/Card/Card";
import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/material";

import { useSocketContext } from "../SocketContext";

type VideoPlayerProps = {};

const SenderVideo: React.FC<VideoPlayerProps> = () => {
  const sx: SxProps<Theme> = {
    m: 1,
    p: 1,
  };

  const videoStyles: React.CSSProperties = {
    width: "100%",
  };

  const { myVideo, stream } = useSocketContext();

  return (
    <Card sx={sx}>
      {stream && (
        <Box>
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={videoStyles}
            id="video"
          />
        </Box>
      )}
    </Card>
  );
};

export default SenderVideo;

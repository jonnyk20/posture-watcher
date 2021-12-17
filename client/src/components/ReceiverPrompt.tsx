import Box from "@mui/material/Box/Box";
import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

import { useSocketContext } from "../SocketContext";

type ReceiverPromptProps = {};

const ReceiverPrompt: React.FC<ReceiverPromptProps> = () => {
  const sx: SxProps<Theme> = {
    m: 1,
    p: 1,
    width: "100%",
  };

  const { hasConnected } = useSocketContext();

  if (hasConnected) return null;

  return (
    <Card sx={sx}>
      <Box>
        <Typography>
          1. Visit this site from your phone and set the camera to your side
        </Typography>
        <Typography>
          2. Look for the "<b>Device ID</b>" on your mobile device{" "}
        </Typography>
        <Typography>
          3. Enter that device ID into the field below and click "Connect"
        </Typography>
      </Box>
    </Card>
  );
};

export default ReceiverPrompt;

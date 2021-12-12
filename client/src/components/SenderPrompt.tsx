import Box from "@mui/material/Box/Box";
import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

import { useSocketContext } from "../SocketContext";

type SenderPromptProps = {};

const SenderPrompt: React.FC<SenderPromptProps> = () => {
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
        <Typography>1. Place the camera at your side</Typography>
        <Typography>
          2. Visit this site from your computer and enter the below{" "}
          <b>Device ID</b>
        </Typography>
      </Box>
    </Card>
  );
};

export default SenderPrompt;

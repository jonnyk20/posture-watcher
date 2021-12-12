import Box from "@mui/material/Box/Box";
import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import Button from "@mui/material/Button/Button";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckIcon from "@mui/icons-material/Check";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";

import { useSocketContext } from "../SocketContext";

type DeviceInfoProps = {
  hideCopyButton?: boolean;
};

const DeviceInfo: React.FC<DeviceInfoProps> = ({ hideCopyButton }) => {
  const sx: SxProps<Theme> = {
    display: "flex",
    width: "100%",
    m: 1,
    alignItems: "center",
    justifyContent: "center",
    p: 1,
  };
  const { me } = useSocketContext();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (_: string, result: boolean) => {
    setIsCopied(result);
  };

  const Icon = isCopied ? CheckIcon : AssignmentIcon;
  const buttonText = isCopied ? "Copied" : "Copy";

  return (
    <Card sx={sx}>
      <Typography display="inline" variant="h6">
        Current Device ID: &nbsp;
      </Typography>
      <Typography
        display="inline"
        variant="h6"
        color="primary"
        fontWeight="bold"
      >
        {me}
      </Typography>
      {!hideCopyButton && (
        <Box sx={{ ml: 1 }}>
          <CopyToClipboard text={me} onCopy={handleCopy}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Icon />}
            >
              {buttonText}
            </Button>
          </CopyToClipboard>
        </Box>
      )}
    </Card>
  );
};

export default DeviceInfo;

import Card from "@mui/material/Card/Card";
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import CloseIcon from "@mui/icons-material/Close";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { Button, Typography } from "@mui/material";
import { useSocketContext } from "../SocketContext";

type SenderControlsProps = {};

const SenderControls: React.FC<SenderControlsProps> = () => {
  const sx: SxProps<Theme> = {
    display: "flex",
    width: "100%",
    m: 1,
    alignItems: "center",
    justifyContent: "center",
    p: 1,
  };

  const { callAccepted, callEnded, leaveCall, answerCall, isConnecting, call } =
    useSocketContext();

  const { isReceivingCall, from } = call;

  const isConnected = callAccepted && !callEnded;

  const handleClick = isConnected ? leaveCall : answerCall;

  let buttonText = isConnected ? "Disconnect" : "Accept";
  const Icon = isConnected ? CloseIcon : LinkedCameraIcon;

  if (!isReceivingCall && !isConnected) return null;

  const statusText = isConnected ? "Connected to " : "Connection Request from ";

  return (
    <Card sx={sx}>
      <Typography display="inline">
        {statusText}
        <b>{from}</b>
      </Typography>

      <Button
        variant="contained"
        size="small"
        color={isConnected ? "error" : "success"}
        startIcon={<Icon />}
        onClick={handleClick}
        disabled={isConnecting}
        sx={{ ml: 1 }}
      >
        {buttonText}
      </Button>
    </Card>
  );
};

export default SenderControls;

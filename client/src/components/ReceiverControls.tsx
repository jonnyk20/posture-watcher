import Card from "@mui/material/Card/Card";
import LinkedCameraIcon from "@mui/icons-material/LinkedCamera";
import CloseIcon from "@mui/icons-material/Close";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useSocketContext } from "../SocketContext";

type ReceiverControlsProps = {};

const ReceiverControls: React.FC<ReceiverControlsProps> = () => {
  const sx: SxProps<Theme> = {
    display: "flex",
    width: "100%",
    m: 1,
    alignItems: "center",
    justifyContent: "center",
    p: 1,
  };

  const { callAccepted, callEnded, leaveCall, callUser, isConnecting } =
    useSocketContext();

  const [idToCall, setIdToCall] = useState("");

  const isConnected = callAccepted && !callEnded;

  const handleClick = () => {
    if (isConnecting) return;

    if (isConnected) {
      leaveCall();
      return;
    }

    callUser(idToCall);
  };

  let buttonText = isConnected ? "Disconnect" : "Connect";
  const Icon = isConnected ? CloseIcon : LinkedCameraIcon;

  if (isConnecting) {
    buttonText = "Connecting...";
  }

  return (
    <Card sx={sx}>
      {!isConnected && (
        <TextField
          label="Enter Mobile Device ID"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          size="small"
          sx={{ mr: 1 }}
          disabled={isConnecting}
          fullWidth
        />
      )}
      {isConnected && (
        <Typography display="inline">
          Connected to: <b>{idToCall}</b>
        </Typography>
      )}
      <Button
        variant="contained"
        color={isConnected ? "error" : "primary"}
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

export default ReceiverControls;

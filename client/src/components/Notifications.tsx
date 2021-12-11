import Button from "@mui/material/Button/Button";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { useSocketContext } from "../SocketContext";

type NotificationsProps = {};

const Notifications: React.FC<NotificationsProps> = () => {
  const sx: SxProps<Theme> = {};
  const { answerCall, call, callAccepted } = useSocketContext();

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;

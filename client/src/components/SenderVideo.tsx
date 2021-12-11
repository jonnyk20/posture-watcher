import Grid from "@mui/material/Grid/Grid";
import Paper from "@mui/material/Paper/Paper";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { useSocketContext } from "../SocketContext";

import ReceiverOptions from "./ReceiverOptions";
import Notifications from "./Notifications";

type VideoPlayerProps = {};

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    // [theme.down('xs')]: {
    //   width: '300px',
    // },
  },
  gridContainer: {
    justifyContent: "center",
    // [theme.breakpoints.down('xs')]: {
    //   flexDirection: 'column',
    // },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));

const SenderVideo: React.FC<VideoPlayerProps> = () => {
  const sx: SxProps<Theme> = {};
  const { name, myVideo, callEnded, stream, call, me } = useSocketContext();
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {me || "ID"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
              id="video"
            />
          </Grid>
        </Paper>
      )}
      <ReceiverOptions>
        <Notifications />
      </ReceiverOptions>
    </Grid>
  );
};

export default SenderVideo;

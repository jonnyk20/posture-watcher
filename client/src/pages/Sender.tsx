import Box from "@mui/material/Box/Box";
import AppBar from "@mui/material/AppBar/AppBar";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import Options from "../components/Options";
import Notifications from "../components/Notifications";
import SenderVideo from "../components/SenderVideo";

type SenderProps = {};

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
    border: "2px solid black",

    // [theme.breakpoints.down("xs")]: {
    //   width: "90%",
    // },
  },
  image: {
    marginLeft: "15px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

const Sender: React.FC<SenderProps> = () => {
  const sx: SxProps<Theme> = {};
  const classes = useStyles();

  return (
    <Box sx={sx}>
      <Box className={classes.wrapper}>
        <AppBar position="static" color="inherit" className={classes.appBar}>
          <Typography variant="h6">Video Chat</Typography>
        </AppBar>
        <SenderVideo />
        <Options>
          <Notifications />
        </Options>
      </Box>
    </Box>
  );
};

export default Sender;

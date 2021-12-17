import Card from "@mui/material/Card/Card";
// import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField/TextField";
import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
// import { useWatcherContext } from "../WatcherContext";
import { Typography } from "@mui/material";
import AngleIndicator from "./AngleIndicator";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectBaseAngle, selectSafeRange } from "../redux/selectors/watcher";
import { setBaseAngle, setOffsetThreshold } from "../redux/watcherSlice";

type WatcherControlsProps = {};

const WatcherControls: React.FC<WatcherControlsProps> = () => {
  const sx: SxProps<Theme> = {
    m: 1,
    p: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  };

  const sectionSx: SxProps<Theme> = {
    p: 1,
    display: "flex",
    alignItems: "center",
    border: "solid 1px",
    borderColor: "lightgrey",
    borderRadius: 2,
    ml: 1,
  };

  // const { startDetection, isLoadingDetector, stopDetection, isDetecting } =
  //   useWatcherContext();
  const baseAngle = useAppSelector(selectBaseAngle);
  const safeRange = useAppSelector(selectSafeRange);

  const dispatch = useAppDispatch();

  const onChangeBaseAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBaseAngle(Number(event.target.value)));
  };
  const onChangeOffsetThreshold = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setOffsetThreshold(Number(event.target.value)));
  };

  // let buttonColor: "error" | "success" | "inherit" = isDetecting
  //   ? "error"
  //   : "success";
  // let buttonText = isDetecting ? "Stop" : "Start";

  // if (isLoadingDetector) {
  //   buttonColor = "inherit";
  //   buttonText = "Loading...";
  // }

  // const onClick = isDetecting ? stopDetection : startDetection;

  // let buttonText = !!detector ? "Stop Detection" : "Start Detection"

  return (
    <Card sx={sx}>
      {/* <Button
        disabled={isLoadingDetector}
        color={buttonColor}
        onClick={onClick}
        size="small"
        variant="contained"
      >
        {buttonText}
      </Button> */}
      <Box sx={sectionSx}>
        <Typography sx={{ mr: 1, width: 100 }}>Target Angle</Typography>
        <TextField
          value={baseAngle}
          type="number"
          size="small"
          inputProps={{ min: 45, max: 135 }}
          onChange={onChangeBaseAngle}
          InputProps={{
            endAdornment: "°",
          }}
        />
      </Box>
      <Box sx={sectionSx}>
        <Box sx={{ mr: 1, width: 100, display: "flex" }}>
          <Typography>Safe Range</Typography>
        </Box>
        <TextField
          value={safeRange}
          type="number"
          size="small"
          inputProps={{ min: 15, max: 135 }}
          onChange={onChangeOffsetThreshold}
          InputProps={{
            endAdornment: "°",
          }}
        />
      </Box>
      <AngleIndicator />
    </Card>
  );
};

export default WatcherControls;

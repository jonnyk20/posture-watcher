import Card from "@mui/material/Card/Card";
import Button from "@mui/material/Button/Button";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

type WatcherControlsProps = {};

const WatcherControls: React.FC<WatcherControlsProps> = () => {
  const sx: SxProps<Theme> = {
    m: 1,
    p: 1,
    width: "100%",
  };

  // const { }

  // let buttonText = !!detector ? "Stop Detection" : "Start Detection"

  return <Card sx={sx}>{/* <Button disabled={isDetecting} ></Button> */}</Card>;
};

export default WatcherControls;

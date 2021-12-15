import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Card from "@mui/material/Card/Card";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { Typography } from "@mui/material";
import { useAppSelector } from "../hooks";
import {
  selectIsFailingCheck,
  selectLastReportedAngle,
  selectScore,
} from "../redux/selectors/watcher";

type ProgressBarProps = {};

const ProgressBar: React.FC<ProgressBarProps> = () => {
  const sx: SxProps<Theme> = {
    display: "flex",
    width: "100%",
    m: 1,
    alignItems: "center",
    justifyContent: "center",
    p: 1,
  };

  const lastReportedAngle = useAppSelector(selectLastReportedAngle);
  const score = useAppSelector(selectScore);
  const isFailingCheck = useAppSelector(selectIsFailingCheck);

  let color: "warning" | "error" | "success" = "success";

  if (isFailingCheck) {
    color = "warning";
  }

  if (isFailingCheck && score < 20) {
    color = "error";
  }

  return (
    <Card sx={sx}>
      <Box sx={{ width: "100%", color }}>
        <LinearProgress variant="determinate" value={score} color={color} />
      </Box>
      <Typography sx={{ ml: 1 }}>{lastReportedAngle}°</Typography>
    </Card>
  );
};

export default ProgressBar;

import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { useAppSelector } from "../hooks";
import {
  selectBaseAngle,
  selectLastReportedAngle,
  selectSafeRange,
} from "../redux/selectors/watcher";
import { DEFAULT_BASE_ANGLE, DEFAULT_SAFE_RANGE } from "../constants/params";

type AngleIndicatorProps = {};

const AngleIndicator: React.FC<AngleIndicatorProps> = () => {
  const baseAngle = useAppSelector(selectBaseAngle);
  const safeRange = useAppSelector(selectSafeRange);
  const lastReportedAngle = useAppSelector(selectLastReportedAngle);

  const sx: SxProps<Theme> = {
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    height: 50,
  };

  const circleSx: SxProps<Theme> = {
    position: "relative",
    width: 100,
    height: 100,
    background: "pink",
    borderRadius: "50%",
    overflow: "hidden",
  };

  // safe range = -135 + ((DEFAULT_SAFE_RANGE - safeRange) * 0.5)
  const sectorSkew = 90 - safeRange;
  const sectorRotation = -90 - safeRange / 2;
  const adjustedSectorRotation =
    sectorRotation + (baseAngle - DEFAULT_BASE_ANGLE);

  const sectorSx: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100vw",
    height: "100vw",
    background: "lightgreen",
    transformOrigin: "0 0",
    transform: `rotate(${adjustedSectorRotation}deg) skew(${sectorSkew}deg)`,
    /* # Increase rotation with base angle
    # For every degree increase in safe range
    # decrease skew by 1 dec
    # decrease rotation by 0.5 deg */
  };

  const baseLineSx: SxProps<Theme> = {
    position: "absolute",
    bottom: "calc(50% - 5px)",
    left: "calc(50% - 2px)",
    height: 102,
    width: 2,
    // background: "#3f51b5",
    backgroundColor: "primary.light",
    opacity: 0.75,
    transform: `rotate(${baseAngle - DEFAULT_BASE_ANGLE}deg)`,
    transformOrigin: "bottom right",
    borderRadius: "2px 2px 0 0",
  };

  const currentLineSx: SxProps<Theme> = {
    position: "absolute",
    bottom: "calc(50% - 5px)",
    left: "calc(50% - 2px)",
    height: 102,
    width: 4,
    backgroundColor: "primary.main",
    transform: `rotate(${lastReportedAngle - 90}deg)`,
    transformOrigin: "bottom right",
    borderRadius: "4px 4px 0 0",
  };

  return (
    <Box sx={sx}>
      <Box sx={circleSx}>
        <Box sx={sectorSx} />
        <Box sx={baseLineSx} />
        <Box sx={currentLineSx} />
      </Box>
    </Box>
  );
};

export default AngleIndicator;

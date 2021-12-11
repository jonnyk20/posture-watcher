import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import ReceiverVideo from "../components/ReceiverVideo";

type ReceiverProps = {};

const Receiver: React.FC<ReceiverProps> = () => {
  const sx: SxProps<Theme> = {};

  return (
    <Box sx={sx}>
      <Box>Receiver</Box>
      <ReceiverVideo />
    </Box>
  );
};

export default Receiver;

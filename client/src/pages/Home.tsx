import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  const sx: SxProps<Theme> = {};

  return (
    <Box sx={sx}>
      <Box>Home</Box>
    </Box>
  );
};

export default Home;

import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import ContentContainer from "../wrapperComponents/ContentContainer";
import UnstyledLink from "../wrapperComponents/UnstyledLink";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
  const sx: SxProps<Theme> = {};

  return (
    <ContentContainer sx={sx}>
      <Typography>Posture Watcher</Typography>
      <UnstyledLink to="/send">
        <Button>Click Here From your Phone</Button>
      </UnstyledLink>
      <UnstyledLink to="/receive">
        <Button>Click Here From your Computer</Button>
      </UnstyledLink>
    </ContentContainer>
  );
};

export default Home;

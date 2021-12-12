import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import SenderVideo from "../components/SenderVideo";
import ContentContainer from "../wrapperComponents/ContentContainer";
import DeviceInfo from "../components/DeviceInfo";
import SenderPrompt from "../components/SenderPrompt";
import SenderControls from "../components/SenderControls";

type SenderProps = {};

const Sender: React.FC<SenderProps> = () => {
  const sx: SxProps<Theme> = {};

  return (
    <ContentContainer sx={sx}>
      <SenderVideo />
      <SenderPrompt />
      <SenderControls />
      <DeviceInfo />
    </ContentContainer>
  );
};

export default Sender;

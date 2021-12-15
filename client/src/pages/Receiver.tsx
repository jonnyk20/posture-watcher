import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

import ReceiverVideo from "../components/ReceiverVideo";
import ContentContainer from "../wrapperComponents/ContentContainer";
import ReceiverPrompt from "../components/ReceiverPrompt";
import DeviceInfo from "../components/DeviceInfo";
import ReceiverControls from "../components/ReceiverControls";
import ProgressBar from "../components/ProgressBar";
import WatcherControls from "../components/WatcherControls";

type ReceiverProps = {};

const Receiver: React.FC<ReceiverProps> = () => {
  const sx: SxProps<Theme> = {};

  return (
    <ContentContainer sx={sx}>
      <ReceiverVideo />
      <ProgressBar />
      <WatcherControls />
      <ReceiverPrompt />
      <ReceiverControls />
      <DeviceInfo hideCopyButton />
    </ContentContainer>
  );
};

export default Receiver;

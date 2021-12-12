import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import Typography from '@mui/material/Typography/Typography';
import { Theme } from '@mui/system/createTheme/createTheme';
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx';

import ContentContainer from '../wrapperComponents/ContentContainer';

type PropsType = {
  text?: string;
};

const Loading: React.FC<PropsType> = (props) => {
  const sx: SxProps<Theme> = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <ContentContainer sx={sx}>
      <Typography variant="h2" color="primary">
        {props.text || 'Loading...'}
      </Typography>
      <CircularProgress color="primary" />
    </ContentContainer>
  );
};

export default Loading;

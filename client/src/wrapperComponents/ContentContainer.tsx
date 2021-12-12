import Container from "@mui/material/Container/Container";
import { Theme } from "@mui/system/createTheme/createTheme";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { ReactElement } from "react";
import { ScreenSize } from "../types/generic";

type ContentContainerProps = {
  children: ReactElement | (ReactElement | ReactElement[])[];
  sx?: SxProps<Theme>;
  maxWidth?: ScreenSize | false;
};

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  sx = {},
  maxWidth,
}) => {
  const defaultSx: SxProps<Theme> = {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    p: 4,
    background: "palette.background.default",
    width: {
      xs: "100%",
      md: 600,
    },
  };

  return (
    <Container sx={{ ...defaultSx, ...sx }} maxWidth={maxWidth || false}>
      {children}
    </Container>
  );
};

export default ContentContainer;

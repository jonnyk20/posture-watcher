import React, {
  createContext,
  useContext,
  ReactElement,
  useState,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useLocation } from "react-router";
import { useWatcherContext } from "./WatcherContext";
import { VideoSizeKey, VIDEO_SIZE } from "./constants/params";
import { isMobile } from "./utils";

// const socketOptions =
//   process.env.NODE_ENV === "production"
//     ? window.location
//     : "http://www.localhost:4000";

const socket = io();

type SocketContextType = {
  call: CallType;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  name: string;
  setName: (name: string) => void;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
};

const EMPTY_CALL: CallType = {
  from: "",
  name: "",
  signal: null,
  isReceivingCall: false,
};

export const defaultContextValue: SocketContextType = {
  call: EMPTY_CALL,
  callAccepted: false,
  myVideo: React.createRef<HTMLVideoElement>(),
  stream: null,
  name: "Jonny",
  setName: () => {},
  callEnded: false,
  me: "",
  callUser: () => {},
  leaveCall: () => {},
  answerCall: () => {},
};

export const SocketContext = createContext(defaultContextValue);

SocketContext.displayName = "Workflows.SocketContext";

type CallType = {
  from: string;
  name: string;
  signal: any;
  isReceivingCall: boolean;
};

export const SocketProvider: React.FC = ({ children }): ReactElement => {
  const [stream, setSteam] = useState<MediaStream | null>(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState(EMPTY_CALL);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [targetFPS] = useState(5);
  const [sizeOption] = useState<VideoSizeKey>("640 X 480");

  const myVideo = useRef<HTMLVideoElement>(null);
  const { setupWatcher, videoRef } = useWatcherContext();

  const connectionRef = useRef<Peer.Instance>();
  const location = useLocation();
  const isSendPath = location.pathname === "/send";

  useEffect(() => {
    socket.on("me", (id: string) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({
        from,
        name: callerName,
        isReceivingCall: true,
        signal,
      });
    });
  }, []);

  useEffect(() => {
    if (!isSendPath) return;

    const size = VIDEO_SIZE[sizeOption];
    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        // Only setting the video to a specified size for large screen, on
        // mobile devices accept the default size.
        width: isMobile() ? VIDEO_SIZE["360 X 270"].width : size.width,
        height: isMobile() ? VIDEO_SIZE["360 X 270"].height : size.height,
        frameRate: {
          ideal: targetFPS,
        },
      },
    };

    navigator.mediaDevices.getUserMedia(videoConfig).then((currentStream) => {
      setSteam(currentStream);

      if (!myVideo.current) return;
      myVideo.current.srcObject = currentStream;
    });
  }, [isSendPath]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream || undefined,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      if (!videoRef.current) return;

      setupWatcher(currentStream);

      videoRef.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream || undefined,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      if (!videoRef.current) return;

      setupWatcher(currentStream);

      videoRef.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current?.destroy();

    window.location.reload();
  };

  const contextValue: SocketContextType = {
    call,
    callAccepted,
    myVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType =>
  useContext(SocketContext);

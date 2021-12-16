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
import {
  FRAMES_PER_SECOND,
  VideoSizeKey,
  VIDEO_SIZE,
} from "./constants/params";
import { isDev, isMobile } from "./utils";

const socket = isDev()
  ? io("http://www.localhost:4000", { reconnectionAttempts: 0 })
  : io();

type SocketContextType = {
  call: CallType;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
  hasConnected: boolean;
  isConnecting: boolean;
  isStreaming: boolean;
  isReceivingStream: boolean;
};

export const EMPTY_CALL: CallType = {
  from: "no_one",
  isReceivingCall: false,
};

export const defaultContextValue: SocketContextType = {
  call: EMPTY_CALL,
  callAccepted: false,
  myVideo: React.createRef<HTMLVideoElement>(),
  stream: null,
  callEnded: false,
  me: "",
  callUser: () => {},
  leaveCall: () => {},
  answerCall: () => {},
  hasConnected: false,
  isConnecting: false,
  isStreaming: false,
  isReceivingStream: false,
};

export const SocketContext = createContext(defaultContextValue);

SocketContext.displayName = "Workflows.SocketContext";

type CallType = {
  from: string;
  isReceivingCall: boolean;
};

export const SocketProvider: React.FC = ({ children }): ReactElement => {
  const [stream, setSteam] = useState<MediaStream | null>(null);
  const [me, setMe] = useState("unavailable");
  const [call, setCall] = useState(EMPTY_CALL);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [targetFPS] = useState(FRAMES_PER_SECOND);
  const [sizeOption] = useState<VideoSizeKey>("640 X 480");
  const [isConnecting, setIsConnecting] = useState(false);
  const [callerId, setCallerId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isReceivingStream, setIsReceivingStream] = useState(false);

  const myVideo = useRef<HTMLVideoElement>(null);
  const { setupWatcher, videoRef } = useWatcherContext();

  const connectionRef = useRef<Peer.Instance>();
  const location = useLocation();
  const isSendPath = location.pathname === "/send";

  useEffect(() => {
    socket.on("me", (id: string) => setMe(id));

    socket.on("callUser", ({ from }) => {
      setCall({
        from,
        isReceivingCall: true,
      });
    });
  }, []);

  useEffect(() => {
    if (!!callerId) {
      socket.on("requestStream", ({ from, signalData }) => {
        if (from === callerId) {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream || undefined,
          });

          peer.on("signal", (data) => {
            socket.emit("sendStream", { callerId, from: me, signalData: data });
            setIsStreaming(true);
          });

          peer.signal(signalData);

          connectionRef.current = peer;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callerId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSendPath]);

  const answerCall = () => {
    setCallAccepted(true);

    socket.emit("answerCall", call.from);
    setCallerId(call.from);
  };

  const requestStream = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
    });

    peer.on("signal", (data) => {
      socket.emit("requestStream", {
        userToCall: id,
        from: me,
        signalData: data,
      });
    });

    socket.on("streamSent", ({ from, signal }) => {
      if (from === id) {
        peer.signal(signal);
      }
    });

    peer.on("stream", (currentStream) => {
      if (!videoRef.current) return;
      setIsReceivingStream(true);
      setupWatcher(currentStream);

      videoRef.current.srcObject = currentStream;
    });

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    setIsConnecting(true);

    socket.emit("callUser", {
      userToCall: id,
      from: me,
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setIsConnecting(false);
      requestStream(id);
    });
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
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    hasConnected: callAccepted,
    isConnecting,
    isStreaming,
    isReceivingStream,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType =>
  useContext(SocketContext);

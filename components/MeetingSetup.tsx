// "use client";
// import {
//   DeviceSettings,
//   useCall,
//   VideoPreview,
// } from "@stream-io/video-react-sdk";
// import React, { useState, useEffect } from "react";
// import { Button } from "./ui/button";

// const MeetingSetup = ({
//   setIsSetupComplete,
// }: {
//   setIsSetupComplete: (value: boolean) => void;
// }) => {
//   const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
//   const call = useCall();
//   if (!call) {
//     throw new Error("usecall must be used within StreamCall component");
//   }
//   useEffect(() => {
//     if (isMicCamToggledOn) {
//       call.camera.disable();
//       call.microphone.disable();
//     } else {
//       call?.camera.enable();
//       call?.microphone.enable();
//     }
//   }, [isMicCamToggledOn, call.camera, call.microphone]);
//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
//       <h1 className="text-2xl font-bold">Setup</h1>
//       <VideoPreview />
//       <div className="flex h-16 items-center justif-center gap-3">
//         <label className="flex items-center justify-center gap-2 font-medium">
//           <input
//             type="checkbox"
//             checked={isMicCamToggledOn}
//             onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
//           />
//           Join with mic and camera off
//         </label>
//         <DeviceSettings />
//       </div>
//       <Button
//         onClick={() => {
//           call.join();
//           setIsSetupComplete(true);
//         }}
//         className="rounded-md bg-green-500 px-4 py-2.5"
//       >
//         Join Meeting
//       </Button>
//     </div>
//   );
// };

// export default MeetingSetup;
"use client";
import { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived) return;

  if (callHasEnded) return;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();

          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;

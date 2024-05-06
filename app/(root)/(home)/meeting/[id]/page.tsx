// "use client";
// import Loader from "@/components/Loader";
// import MeetingRoom from "@/components/MeetingRoom";
// import MeetingSetup from "@/components/MeetingSetup";
// import { useGetCallById } from "@/hooks/useGetCallById";
// import { useUser } from "@clerk/nextjs";
// import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
// import React, { useState } from "react";

// const Meeting = ({ params: id }: { params: { id: string } }) => {
//   const { user, isLoaded } = useUser();
//   const [isSetupComplete, setIsSetupComplete] = useState(false);
//   const { call, isCallLoading } = useGetCallById(id);
//   if (!isLoaded || isCallLoading) return <Loader />;
//   return (
//     <main className="h-screen w-full">
//       <StreamCall call={call}>
//         <StreamTheme>
//           {!isSetupComplete ? <MeetingSetup /> : <MeetingRoom />}
//         </StreamTheme>
//       </StreamCall>
//     </main>
//   );
// };

// export default Meeting;
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetCallById } from "@/hooks/useGetCallById";
// import Alert from "@/components/Alert";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";

const Meeting = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
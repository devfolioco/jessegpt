"use client";

import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import TranscriptionView from "@/components/TranscriptionView";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Room, RoomEvent } from "livekit-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ConnectionDetails } from "../api/connection-details/route";

export default function TalkPage() {
  const [mood, setMood] = useState<null | "excited" | "critical">(null);
  const [room] = useState(new Room());
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  // Connect to LiveKit when mood is selected
  useEffect(() => {
    if (!mood) return;
    let cancelled = false;
    async function connect() {
      setConnecting(true);
      const url = new URL(
        process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
        window.location.origin
      );
      const response = await fetch(`${url.toString()}?mood=${mood}`);
      const connectionDetailsData: ConnectionDetails = await response.json();

      if (cancelled) return;

      await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);

      room.registerTextStreamHandler("end_conversation", async (reader, participantInfo) => {
        const info = reader.info;
        console.log(
          `Received text stream from ${participantInfo.identity}\n` +
            `  Topic: ${info.topic}\n` +
            `  Timestamp: ${info.timestamp}\n` +
            `  ID: ${info.id}\n` +
            `  Size: ${info.size}` // Optional, only available if the stream was sent with `sendText`
        );

        // Option 1: Process the stream incrementally using a for-await loop.
        for await (const chunk of reader) {
          console.log(`Next chunk: ${chunk}`);
        }
      });

      if (!cancelled) setConnected(true);
      setConnecting(false);
    }
    connect();
    return () => {
      cancelled = true;
    };
  }, [room, mood]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);
    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  // Persona selection UI
  if (!mood) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0C1110]">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 py-16">
          {/* JesseXBT (Optimistic) */}
          <div className="flex-1 flex flex-col items-center text-center bg-transparent">
            <Image
              src="/mellow-jesse.gif"
              alt="JesseXBT Avatar"
              width={180}
              height={180}
              className="rounded-none mb-6"
              priority
            />
            <h2 className="text-4xl font-serif font-bold text-white mb-2">JesseXBT</h2>
            <p className="text-lg text-white/90 mb-2">The relentlessly optimistic Jesse Pollak.</p>
            <p className="text-base text-white/80 mb-8 max-w-xs">
              Sees massive potential everywhere, bursting with Onchain Summer energy, &amp; ready to
              hype your vision to the moon.
            </p>
            <button
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold bg-yellow-300 text-black hover:bg-yellow-200 transition-all shadow-md"
              onClick={() => setMood("excited")}
            >
              <span role="img" aria-label="microphone">
                🎤
              </span>{" "}
              Start talking
            </button>
          </div>
          {/* SupaBald JesseXBT (Critical) */}
          <div className="flex-1 flex flex-col items-center text-center bg-transparent">
            <Image
              src="/critical-jesse.gif"
              alt="SupaBald JesseXBT Avatar"
              width={180}
              height={180}
              className="rounded-none mb-6"
              priority
            />
            <h2 className="text-4xl font-serif font-bold text-white mb-2">SupaBald JesseXBT</h2>
            <p className="text-lg text-white/90 mb-2">The brutally honest Jesse Pollak.</p>
            <p className="text-base text-white/80 mb-8 max-w-xs">
              Cuts through the hype, challenges every premise, &amp; believes great ideas must
              survive intense scrutiny to succeed.
            </p>
            <button
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md"
              onClick={() => setMood("critical")}
            >
              <span role="img" aria-label="microphone">
                🎤
              </span>{" "}
              Start talking
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Show loading state while connecting
  if (connecting && !connected) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0C1110]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-white text-2xl font-bold mb-4">
            Connecting to{" "}
            {mood === "excited" ? "JesseXBT (Optimistic)" : "SupaBald JesseXBT (Critical)"}...
          </div>
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  // Voice assistant UI
  return (
    <main data-lk-theme="default" className="h-full grid content-center bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="lk-room-container max-h-[90vh]">
          <SimpleVoiceAssistant mood={mood} />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant({ mood }: { mood: "excited" | "critical" }) {
  const { state: agentState, audioTrack: agentAudioTrack } = useVoiceAssistant();
  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#638596] pt-8">
      <div
        className="absolute inset-0 pointer-events-none -z-10 h-full w-full bg-[radial-gradient(rgba(229,231,235,0.3)_1px,transparent_2px)] [background-size:36px_36px]"
        aria-hidden="true"
      ></div>

      <div className="flex flex-col items-center mb-6 relative">
        <div className="flex flex-row">
          <Image
            src={mood === "critical" ? "/critical-jesse.gif" : "/mellow-jesse.gif"}
            alt="JesseXBT Avatar"
            width={254}
            height={254}
            className="rounded-none"
            priority
          />
          <div className="bg-[#FFF68D] mt-[64px] w-[64px] h-[64px] rounded-full flex justify-center items-center relative overflow-hidden">
            <BarVisualizer
              state={agentState}
              trackRef={agentAudioTrack}
              barCount={5}
              className="agent-visualizer"
              options={{ maxHeight: 40 }}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col items-center overflow-hidden z-10 mt-16">
        <div className="max-w-2xl h-[560px] overflow-y-auto">
          <TranscriptionView />
        </div>
      </div>

      <RoomAudioRenderer />
      <NoAgentNotification state={agentState} />

      {/* Centered controls at the bottom - Fixed */}
      <div className="w-full flex justify-center fixed bottom-0 left-0 px-4 py-6 z-10">
        <div className="flex flex-row items-center gap-4 bg-white/90 rounded-xl shadow-lg px-6 py-3">
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
        </div>
      </div>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

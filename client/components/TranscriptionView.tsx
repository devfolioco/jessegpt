import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";
import * as React from "react";

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    const transcription = combinedTranscriptions[combinedTranscriptions.length - 1];
    if (transcription) {
      const transcriptionElement = document.getElementById(transcription.id);
      if (transcriptionElement) {
        transcriptionElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [combinedTranscriptions]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto py-8">
      {combinedTranscriptions.map((segment) => (
        <div
          id={segment.id}
          key={segment.id}
          className={
            segment.role === "assistant"
              ? "bg-white text-gray-900 rounded-2xl px-6 py-4 self-start max-w-[70%] shadow-md text-lg"
              : "bg-[#22302B] text-white rounded-2xl px-6 py-4 self-end max-w-[70%] shadow-md text-lg"
          }
          style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
        >
          {(segment.text as string).toLocaleLowerCase()}
        </div>
      ))}
    </div>
  );
}

import { MediaDeviceMenu, TrackToggle } from '@livekit/components-react';
import {
  useLocalParticipant,
  useLocalParticipantPermissions,
  usePersistentUserChoices,
} from '@livekit/components-react';
import { StartMediaButton } from '@livekit/components-react';
import { BarVisualizer, DisconnectButton } from '@livekit/components-react';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-react';
import { Track } from 'livekit-client';
import * as React from 'react';

/** @beta */
export type VoiceAssistantControlBarControls = {
  microphone?: boolean;
  leave?: boolean;
};

/** @beta */
export interface VoiceAssistantControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  controls?: VoiceAssistantControlBarControls;
  /**
   * If `true`, the user's device choices will be persisted.
   * This will enables the user to have the same device choices when they rejoin the room.
   * @defaultValue true
   */
  saveUserChoices?: boolean;
}

/**
 * @example
 * ```tsx
 * <LiveKitRoom ... >
 *   <VoiceAssistantControlBar />
 * </LiveKitRoom>
 * ```
 * @beta
 */
export function CustomVoiceAssistantControlBar({
  controls,
  saveUserChoices = true,
  onDeviceError,
  ...props
}: VoiceAssistantControlBarProps) {
  const visibleControls = { leave: true, microphone: true, ...controls };

  const localPermissions = useLocalParticipantPermissions();
  const { microphoneTrack, localParticipant } = useLocalParticipant();

  const micTrackRef: TrackReferenceOrPlaceholder = React.useMemo(() => {
    return {
      participant: localParticipant,
      source: Track.Source.Microphone,
      publication: microphoneTrack,
    };
  }, [localParticipant, microphoneTrack]);

  if (!localPermissions) {
    visibleControls.microphone = false;
  } else {
    visibleControls.microphone ??= localPermissions.canPublish;
  }

  const htmlProps = { ...props, className: 'lk-agent-control-bar' };

  const { saveAudioInputEnabled, saveAudioInputDeviceId } = usePersistentUserChoices({
    preventSave: !saveUserChoices,
  });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) => {
      if (isUserInitiated) {
        saveAudioInputEnabled(enabled);
      }
    },
    [saveAudioInputEnabled]
  );

  return (
    <div {...htmlProps}>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <TrackToggle
            className=" text-[#8E989C] hover:text-[#8E989C]"
            style={{
              // @ts-expect-error Update color
              '--lk-control-active-bg': 'transparent',
              '--lk-control-active-color': 'transparent',
              '--lk-control-active-hover-bg': 'transparent',
              '--lk-control-bg': 'transparent',
              '--lk-control-hover-bg': 'transparent',
              '--lk-fg': '#273339',

              paddingLeft: '24px',
              paddingRight: '8px',
            }}
            source={Track.Source.Microphone}
            showIcon={true}
            onChange={microphoneOnChange}
            onDeviceError={error => onDeviceError?.({ source: Track.Source.Microphone, error })}
          >
            <BarVisualizer
              trackRef={micTrackRef}
              barCount={7}
              options={{ minHeight: 32 }}
              style={{ margin: '0 24px' }}
            />
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? 'default')}
              style={{
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
      )}

      {visibleControls.leave && <DisconnectButton>{'Disconnect'}</DisconnectButton>}
      <StartMediaButton />
    </div>
  );
}

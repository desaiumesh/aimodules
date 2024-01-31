import { AvatarConfig, AvatarSynthesizer, PropertyId, ResultReason, SpeechConfig, SpeechSynthesisResult, SynthesisResult } from "microsoft-cognitiveservices-speech-sdk";
import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
import WebRTCPeerConnection from "./WebRTCPeerConnection";
import { Deferred } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/Promise";
import { Events } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/Events";
import { EventType, PlatformEvent } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common/PlatformEvent";

export default class ReactAvatarSynthesizer extends AvatarSynthesizer{

    constructor(speechConfig: SpeechConfig, avatarConfig: AvatarConfig){
        super(speechConfig, avatarConfig);
    }

    public async startAvatarAsync(peerConnection: WebRTCPeerConnection): Promise<SynthesisResult> {
        
        this.privIceServers = peerConnection.getConfiguration().iceServers;
        const iceGatheringDone = new Deferred<void>();
      
        peerConnection.addEventListener("icegatheringstatechange", () => {
            Events.instance.onEvent(new PlatformEvent("peer connection: ice gathering state: " + peerConnection.iceGatheringState, EventType.Debug));
            if (peerConnection.iceGatheringState === "complete") {
                Events.instance.onEvent(new PlatformEvent("peer connection: ice gathering complete.", EventType.Info));
                iceGatheringDone.resolve();
            }
          });

        peerConnection.addEventListener("icecandidate", (event) => {
            if (event.candidate) {
                Events.instance.onEvent(new PlatformEvent("peer connection: ice candidate: " + event.candidate.candidate, EventType.Debug));
            } else {
                Events.instance.onEvent(new PlatformEvent("peer connection: ice candidate: complete", EventType.Debug));
                iceGatheringDone.resolve();
            }
        });
       
        // Set a timeout for ice gathering, currently 2 seconds.
        setTimeout((): void => {
            if (peerConnection.iceGatheringState !== "complete") {
                Events.instance.onEvent(new PlatformEvent("peer connection: ice gathering timeout.", EventType.Warning));
                iceGatheringDone.resolve();
            }
        }, 2000);

        let sessionConstraints = {
            mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true,
                VoiceActivityDetection: true
            }
        };

        const sdp = await peerConnection.createOffer(sessionConstraints);
        await peerConnection.setLocalDescription(sdp);
        
        await iceGatheringDone.promise;
        Events.instance.onEvent(new PlatformEvent("peer connection: got local SDP.", EventType.Info));
        this.privProperties.setProperty(PropertyId.TalkingAvatarService_WebRTC_SDP, JSON.stringify(peerConnection.localDescription));

        const result: SpeechSynthesisResult = await this.speak("", false);
        if (result.reason !== ResultReason.SynthesizingAudioCompleted) {
            return new SynthesisResult(
                result.resultId,
                result.reason,
                result.errorDetails,
                result.properties,
            );
        }
        const sdpAnswerString: string = atob(result.properties.getProperty(PropertyId.TalkingAvatarService_WebRTC_SDP));
        const sdpAnswer = new RTCSessionDescription(
            JSON.parse(sdpAnswerString) ,
        );
        await peerConnection.setRemoteDescription(sdpAnswer);
        console.log("In startAvatarAsync - end");

        return new SynthesisResult(
            result.resultId,
            result.reason,
            undefined,
            result.properties,
        );
    }


}
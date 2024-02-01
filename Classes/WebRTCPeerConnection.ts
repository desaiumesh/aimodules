import { RTCPeerConnection } from "react-native-webrtc";

declare type RTCIceServer = {
  credential?: string;
  url?: string;
  urls?: string | string[];
  username?: string;
};

declare type RTCConfiguration = {
  bundlePolicy?: 'balanced' | 'max-compat' | 'max-bundle';
  iceCandidatePoolSize?: number;
  iceServers?: RTCIceServer[];
  iceTransportPolicy?: 'all' | 'relay';
  rtcpMuxPolicy?: 'negotiate' | 'require';
};

export default class WebRTCPeerConnection extends RTCPeerConnection{
   
    private rtcConfiguration: RTCConfiguration; 

    constructor(rtcConfiguration : RTCConfiguration){

        rtcConfiguration.bundlePolicy = "balanced";

        super(rtcConfiguration);
        this.rtcConfiguration = rtcConfiguration;
      }

      getConfiguration(): RTCConfiguration {  
        return this.rtcConfiguration;  
      }  
}
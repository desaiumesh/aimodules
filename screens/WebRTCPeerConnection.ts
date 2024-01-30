import { RTCPeerConnection } from "react-native-webrtc";
import { RTCConfiguration } from "react-native-webrtc/lib/typescript/RTCPeerConnection";


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
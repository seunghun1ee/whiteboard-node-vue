const jitsiDomain = process.env.VUE_APP_JITSI_DOMAIN;

export const options = {
    hosts: {
        domain: jitsiDomain,
        muc: `conference.${jitsiDomain}`,
        focus: `focus.${jitsiDomain}`,
    },
    externalConnectUrl: `https://${jitsiDomain}/http-pre-bind`,
    enableP2P: true,
    p2p: {
        enabled: true,
        useStunTurn: true,
        disabledCodec: false,
        preferredCodec: true,
        disableSimulcast: false
    },
    useStunTurn: true,
    serviceUrl: `https://${jitsiDomain}/http-bind`,
    // websocket: `wss://${jitsiDomain}/xmpp-websocket`,
    clientNode: `http://${jitsiDomain}/jitsimeet`
};

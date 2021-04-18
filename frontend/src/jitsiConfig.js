const jitsiDomain = "";

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
        preferH264: true,
        disableH264: true,
        useStunTurn: true,
    },
    useStunTurn: true,
    serviceUrl: `https://${jitsiDomain}/http-bind`,
    // websocket: `wss://${jitsiDomain}/xmpp-websocket`,
    clientNode: `http://${jitsiDomain}/jitsimeet`
};

function fingerprintDevice(ip, msg = "") {
  const text = msg.toString().toLowerCase();

  let vendor = null;
  let confidence = 50;

  if (text.includes("hikvision")) {
    vendor = "hikvision";
    confidence = 95;
  } else if (text.includes("dahua")) {
    vendor = "dahua";
    confidence = 95;
  } else if (text.includes("axis")) {
    vendor = "axis";
    confidence = 95;
  } else if (text.includes("uniview")) {
    vendor = "uniview";
    confidence = 90;
  }

  const rtspGuess = vendor
    ? `rtsp://\${ip}:554/stream1`
    : `rtsp://\${ip}:554/live`;

  return {
    ip,
    vendor,
    confidence,
    adapter: "onvif",
    capabilities: {
      ptz: text.includes("ptz"),
      audio: text.includes("audio"),
      motion: true
    },
    streams: {
      rtsp: rtspGuess
    }
  };
}

export const ONVIFDiscoveryModule = {
  id: "onvif",

  async scan() {
    const dgram = await import("dgram");
    const devices = [];

    const socket = dgram.createSocket("udp4");

    return new Promise((resolve) => {
      try {
        socket.on("message", (msg, rinfo) => {
          devices.push(fingerprintDevice(rinfo.address, msg));
        });

        socket.bind(() => {
          socket.setBroadcast(true);

          const probe = Buffer.from("onvif-probe");
          socket.send(probe, 0, probe.length, 3702, "239.255.255.250");

          setTimeout(() => {
            socket.close();
            resolve(devices);
          }, 2500);
        });

      } catch (err) {
        resolve([]);
      }
    });
  }
};

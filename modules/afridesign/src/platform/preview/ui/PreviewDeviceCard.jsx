/**
 * AfriDesign Preview Device Card
 *
 * Purpose:
 * Displays available preview
 * devices.
 *
 * Rule:
 * UI composition only.
 */

export default function PreviewDeviceCard({

 device,

 onOpen

}) {

 return (

  <button

   className="preview-device-card"

   onClick={() =>
     onOpen &&
     onOpen(device)
   }

  >

    <div className="device-icon">

      {device.platform === "ios"
        ? "📱"
        : device.type === "mobile"
        ? "📱"
        : device.id === "tablet"
        ? "▣"
        : "🖥️"
      }

    </div>


    <h3>

      {device.name}

    </h3>


    <small>

      {device.viewport || "Device Preview"}

    </small>


  </button>

 );

}

/**
 * AfriDesign Preview Gallery
 *
 * Purpose:
 * Shows all responsive
 * preview options.
 *
 * Rule:
 * UI composition only.
 */

import DevicePreviewRegistry
from "../DevicePreviewRegistry";

import PreviewDeviceCard
from "./PreviewDeviceCard";


import PreviewGalleryController
from "../PreviewGalleryController";


export default function PreviewGallery({

 project

}) {


 function openDevice(device){

   PreviewGalleryController.selectDevice(
     device
   );

 }


 return (

  <section className="preview-gallery">


    <header>

      <h2>
        Responsive Preview
      </h2>

      <p>
        Test your design across devices.
      </p>

    </header>


    <div className="preview-device-grid">


    {

      DevicePreviewRegistry.map(

        device => (

          <PreviewDeviceCard

            key={device.id}

            device={device}

            onOpen={openDevice}

          />

        )

      )

    }


    </div>


  </section>

 );

}

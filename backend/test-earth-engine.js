import ee from "@google/earthengine";
import fs from "fs";

console.log("Starting Earth Engine...");

const privateKey = JSON.parse(
  fs.readFileSync("./.private-key.json", "utf8")
);

ee.data.authenticateViaPrivateKey(
  privateKey,
  () => {
    console.log("Earth Engine authentication successful.");

    ee.initialize(
      null,
      null,
      () => {
        console.log("Earth Engine initialized successfully.");

        const image = ee.Image(
          "COPERNICUS/S2_SR_HARMONIZED/20260818T051651_20260818T053453_T43PFP"
        );

        image.getInfo((error, info) => {
          if (error) {
            console.error("Earth Engine request failed:");
            console.error(error);
            return;
          }

          console.log("Earth Engine image received!");
          console.log("Image ID:", info.id);
        });
      },
      (error) => {
        console.error("Earth Engine initialization failed:");
        console.error(error);
      },
      null,
      "agrobridge-ai"
    );
  },
  (error) => {
    console.error("Earth Engine authentication failed:");
    console.error(error);
  }
);
# AgroBridge API Notes

The backend exposes application endpoints for farm-related data and geospatial analysis.

## NDVI Workflow

The NDVI workflow uses the Google Earth Engine integration to obtain vegetation information and returns structured farm analysis data to the frontend.

## Configuration

Store Earth Engine credentials and service configuration in environment variables. Do not place secrets directly in source code.

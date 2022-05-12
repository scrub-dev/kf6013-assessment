const FILE_TYPE = ".png"                  // Image filetype
const FILE_PATH = "assets/images/"        // Path to the images
const ICONS = {                           // The icons available mapped to their image names
  net_zero:"netzero",
  climate_change:"climatechange",
  both: "combined"
}

const getIcon = ICON => {                 // Returns the filepath to a specified icon in ICONS object
  return FILE_PATH + ICON + FILE_TYPE     // Combines the variables to produce a full string to the location of the icon image
}
const FILE_TYPE = ".png"
const FILE_PATH = "assets/images/"
const ICONS = {
  net_zero:"netzero",
  climate_change:"climatechange",
  both: "combined"
}

const getIcon = ICON => {                 // Returns the filepath to a specified icon in ICONS object
  return FILE_PATH + ICON + FILE_TYPE
}
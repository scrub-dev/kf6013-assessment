const FILE_TYPE = ".png"
const FILE_PATH = "../images/"
const ICONS = {
  net_zero:"netzero",
  climate_change:"climatechange",
  both: "combined"
}

const getIcon = ICON => {
  return FILE_PATH + ICON + FILE_TYPE
}
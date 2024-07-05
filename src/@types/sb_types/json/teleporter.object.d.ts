declare enum ObjectRarity {
  "Common",
  "Legendary",
}

declare interface TeleporterObject {
  objectName : string, //Unique!
  colonyTags : string[],
  objectType : string,
  rarity : typeof ObjectRarity,
  description : string, //full description
  shortdescription : string, //In-game name
  price : int, //in pixels
  printable : boolean,

  // apexDescription : string,
  // avianDescription : string,
  // floranDescription : string,
  // glitchDescription : string,
  // humanDescription : string,
  // hylotlDescription : string,
  // novakidDescription : string,

  category : string,
  lightColor? : Vec3I, //RGB
  lightPosition : [0, 1],

  interactAction? : string,
  interactData? : string, //path relative to assets, starts with /

  inventoryIcon : string, //path, relative (searches in the same folder)
  orientations? : unknown[],

  health : int,
  rooting : boolean,

  breakDropPool? : string, //name of treasure pool to use if broken

  teleporterFootPosition : Vec2I,

  scripts : string[], //paths to scripts
  npcToy? : {
    influence : string[],
    defaultReactions : {[influenceType:string]: [float, string][]},
    preciseStandPositionLeft : [int, float],
    preciseStandPositionRight : [int, float],
    maxNpcs : unsigned
  }
}
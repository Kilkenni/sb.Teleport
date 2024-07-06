declare interface ItemRecipe {
  currencyInputs: JSON, //FIXME
  input: ItemDescriptor[],
  output: ItemDescriptor,
  duration: float,
  groups: JSON[], //FIXME
  collectables: {[key:string]: JSON}, //FIXME
  matchInputParameters: boolean
}
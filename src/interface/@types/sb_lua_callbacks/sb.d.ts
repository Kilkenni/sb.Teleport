declare module sb {
  function print(luaValue:any):string;
  function printJson(value: JSON, pretty?:number):string;
}

// export {
//   print,
//   printJson,
// }
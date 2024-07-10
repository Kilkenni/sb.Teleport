declare interface TpDialogConfig {
  planetaryEnvironmentHazards: {
    [hazard:string]: {
      displayName: string,
      icon: string,
    }
  }
  mel_tp_dialog: {
    [parameter: string]: string,
  },
  mel_tp_edit: {
    "mel_tp_confirm": { [parameter: string]: string},
    [parameter: string]: string|any,
  }
}
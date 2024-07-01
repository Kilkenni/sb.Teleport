declare interface TpDialogConfig {
  planetaryEnvironmentHazards: {
    [hazard:string]: {
      displayName: string,
      icon: string,
    }
  }
  mel_tp_dialog: {
    [parameter: string]: string,
  }
}
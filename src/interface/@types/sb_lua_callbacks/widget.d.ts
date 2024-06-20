declare module widget {
  /**
  * Plays a sound. 
  * @param audio 
  * @param loops - integer, default: 0
  * @param volume - float, default: 1.0f
  */
  function playSound(audio: string, loops?: number, volume?: number):void;
}
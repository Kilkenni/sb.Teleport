/**
 * Class to automate handling promises.
 */
interface PromiseKeeper {
  __index: any, //self
  promises: {promise: any, onSuccess?: Function, onError?: Function}[]
  /**
   * Add handlers for a promise
   * @param promise 
   * @param onSuccess Function to run on success
   * @param onError Function to run on error
   */
  add(promise: RpcPromise<any>, onSuccess?: Function, onError?: Function):void;
  empty():boolean; //is empty?
  /**
   * Run callbacks for finished promises and delete them
   */
  update():void;
}

declare const promises:PromiseKeeper;

export default promises;
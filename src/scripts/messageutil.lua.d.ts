interface PromiseKeeper {
  __index: any, //self
  promises: {promise: any, onSuccess?: Function, onError?: Function}[]
  add(promise: RpcPromise<any>, onSuccess?: Function, onError?: Function):void;
  empty():boolean; //is empty?
  update():void; //run callbacks for finished promises and delete them
}

declare const promises:PromiseKeeper;

export default promises;
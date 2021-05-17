declare module 'hexo-log' {
  interface HexoLogger {
    debug: (...arg: any[]) => void;
    d: (...arg: any[]) => void;
    info: (...arg: any[]) => void;
    i: (...arg: any[]) => void;
    warn: (...arg: any[]) => void;
    w: (...arg: any[]) => void;
    error: (...arg: any[]) => void;
    e: (...arg: any[]) => void;
  }

  function hexoLog(options?: { silent?: boolean; debug?: boolean; }): HexoLogger;

  export = hexoLog;
}

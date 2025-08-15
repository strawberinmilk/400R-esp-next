// BLE通信関連のDTO（型定義）

export interface StatusType {
  type: string;
  footLight: {
    volume: number;
    mode: number;
    isLighting: boolean;
  };
  preset: {
    current: string;
    isMatched: boolean;
  };
  constants: {
    footLight: {
      min: number;
      max: number;
      modeVal: number[];
      modeName: string[];
    };
    preset: {
      presetNameList: string[];
      presetValueList: number[];
    };
  };
}

export class SetResult {
  exitCode: number;
  message: string;
  constructor(exitCode: number, message: string) {
    this.exitCode = exitCode;
    this.message = message;
  }
}

// 型ガード: SetResultかどうか判定
export const isSetResult = (obj: unknown): obj is SetResult => {
  if (obj instanceof SetResult) return true;
  if (
    obj &&
    typeof obj === "object" &&
    "exitCode" in obj &&
    typeof (obj as any).exitCode === "number" &&
    "message" in obj &&
    typeof (obj as any).message === "string"
  ) {
    return true;
  }
  return false;
};

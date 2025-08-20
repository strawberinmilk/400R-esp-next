// BLE通信関連のDTO（型定義）

// ステータス取得時のレスポンス
export interface GetStatusResponse {
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

// 型ガード: GetStatusResponse
export const isGetStatusResponse = (obj: unknown): obj is GetStatusResponse => {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  const footLight = o.footLight as Record<string, unknown> | undefined;
  const preset = o.preset as Record<string, unknown> | undefined;
  const constants = o.constants as Record<string, unknown> | undefined;
  const constantsFootLight = constants?.footLight as
    | Record<string, unknown>
    | undefined;
  const constantsPreset = constants?.preset as
    | Record<string, unknown>
    | undefined;
  return (
    typeof o.type === "string" &&
    footLight !== undefined &&
    typeof footLight.volume === "number" &&
    typeof footLight.mode === "number" &&
    typeof footLight.isLighting === "boolean" &&
    preset !== undefined &&
    typeof preset.current === "string" &&
    typeof preset.isMatched === "boolean" &&
    constantsFootLight !== undefined &&
    Array.isArray(constantsFootLight.modeVal) &&
    Array.isArray(constantsFootLight.modeName) &&
    constantsPreset !== undefined &&
    Array.isArray(constantsPreset.presetNameList) &&
    Array.isArray(constantsPreset.presetValueList)
  );
};

export interface GetStatusResponse {
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

export class SetResultResponse {
  exitCode: number;
  message: string;
  constructor(exitCode: number, message: string) {
    this.exitCode = exitCode;
    this.message = message;
  }
}

// 型ガード: SetResultResponse
export const isSetResultResponse = (obj: unknown): obj is SetResultResponse => {
  if (obj instanceof SetResultResponse) return true;
  if (
    obj &&
    typeof obj === "object" &&
    typeof (obj as Record<string, unknown>).exitCode === "number" &&
    typeof (obj as Record<string, unknown>).message === "string"
  ) {
    return true;
  }
  return false;
};

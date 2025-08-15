import { useGlobalSnackbar } from "@/util/GlobalSnackbar";
import "@/css/_constants.scss";

/**
 * footLight系の共通Snackbar表示フック
 * statusCode: 0ならprimary, それ以外はerror色
 */
export const useSnackBar = () => {
  const { showSnackbar } = useGlobalSnackbar();

  // CSSカスタムプロパティから色を取得
  const getCssVar = (name: string): string => {
    if (typeof window === "undefined") return "";
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || ""
    );
  };

  const showSnackBarWithExitCode = ({
    exitCode,
    message,
  }: {
    exitCode: number;
    message: string;
  }) => {
    const primaryColor = getCssVar("--primary-color");
    const errorColor = getCssVar("--error-color");
    const color = exitCode === 0 ? primaryColor : errorColor;
    showSnackbar(message, color);
  };

  return { showSnackBarWithExitCode };
};

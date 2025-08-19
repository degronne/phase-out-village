import { usePrefersDarkMode } from "./usePrefersDarkMode";
export function useLightDark(dark: string, light: string){
    const res = usePrefersDarkMode() ? dark : light;
    return res;
}
import "styled-components";

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    backColor: string;
    accentColor: string;
  }
}
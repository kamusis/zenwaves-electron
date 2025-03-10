declare module './getRandomColor' {
  interface ColorResult {
    name: string;
    color: string;
  }

  export default function getRandomColor(isDarkMode: boolean): ColorResult;
}

declare module './waves.js' {
  import p5 from 'p5';

  interface Poem {
    content: string;
    author: string;
    title: string;
  }

  interface WaveColor {
    color: string;
    name: string;
  }

  interface WavesProps {
    isDarkMode: boolean;
    waveColor: WaveColor;
    poem: Poem;
    fontFamily: string;
  }

  class Mountain {
    constructor(color: any, y: number, p: any);
    display(p: any): void;
  }

  export default function waves(p: any): {
    setup: () => void;
    draw: () => void;
    windowResized: () => void;
    updateWithProps: (newProps: WavesProps) => void;
    createWallpaperCanvas: () => Promise<string>;
  };
}

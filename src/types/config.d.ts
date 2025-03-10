declare module './config' {
  interface IntervalOption {
    label: string;
    value: number;
  }

  interface FontOption {
    label: string;
    value: string;
  }

  interface PoemOrigin {
    title: string;
    dynasty: string;
    author: string;
    content: string[];
    translate: string[] | null;
  }

  interface DefaultPoem {
    id: string;
    content: string;
    popularity: number;
    origin: PoemOrigin;
    matchTags: string[];
    recommendedReason: string;
    cacheAt: string;
  }

  export const INTERVAL_OPTIONS: IntervalOption[];
  export const FONT_OPTIONS: FontOption[];
  export const DEFAULT_POEM_ARRAY: DefaultPoem[];
}

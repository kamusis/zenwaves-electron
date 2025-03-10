declare module './loadPoem.js' {
  interface PoemOrigin {
    title: string;
    dynasty: string;
    author: string;
    content: string[];
    translate: string[] | null;
  }

  interface PoemData {
    id: string;
    content: string;
    popularity: number;
    origin: PoemOrigin;
    matchTags: string[];
    recommendedReason: string;
    cacheAt: string;
  }

  interface PoemResult {
    status?: string;
    data: {
      content: string;
      origin: {
        title: string;
        author: string;
      }
    };
    token?: string;
  }

  export default function loadPoem(callback: (result: PoemResult) => void): void;
}

declare module './loadPoem.js' {
  interface PoemOrigin {
    title: string;
    dynasty?: string;
    author: string;
    content?: string[];
    translate?: string[] | null;
  }

  interface PoemData {
    id?: string;
    content: string;
    popularity?: number;
    origin: PoemOrigin;
    matchTags?: string[];
    recommendedReason?: string;
    cacheAt?: string;
  }

  interface PoemResult {
    status: 'success' | 'error';
    data: {
      content: string;
      origin: {
        title: string;
        author: string;
      };
    };
    source?: 'jinrishici' | 'hitokoto' | 'local';
    token?: string;
  }

  interface LoadPoemOptions {
    apiSource?: 'jinrishici' | 'hitokoto';
  }

  export default function loadPoem(
    callback: (result: PoemResult) => void,
    options?: LoadPoemOptions
  ): void;
}

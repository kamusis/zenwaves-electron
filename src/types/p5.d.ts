declare module 'p5' {
  export default class P5 {
    constructor(sketch: (p: any) => void, node?: HTMLElement | null, sync?: boolean);
    
    // Add any specific p5 methods you're using in your code
    // This is a minimal declaration that should fix the TypeScript error
    
    // You can extend this with more specific types as needed
    updateWithProps: (props: any) => void;
    createWallpaperCanvas: () => Promise<string>;
  }
}

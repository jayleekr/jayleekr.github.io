declare module 'remark-mermaid' {
  import { Plugin } from 'unified';
  
  interface RemarkMermaidOptions {
    simple?: boolean;
    launchOptions?: any;
    svgo?: any;
    css?: string;
    browser?: any;
  }
  
  const remarkMermaid: Plugin<[RemarkMermaidOptions?], any>;
  export default remarkMermaid;
}
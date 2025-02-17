declare module "react-syntax-highlighter" {
  import * as React from "react";

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    PreTag?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const Prism: React.FC<SyntaxHighlighterProps>;
  const SyntaxHighlighter: React.FC<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

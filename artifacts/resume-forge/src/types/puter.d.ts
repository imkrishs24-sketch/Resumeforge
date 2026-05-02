declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          prompt: string,
          options?: {
            model?: string;
            stream?: boolean;
          }
        ) => Promise<{ message: { content: [{ text: string }] } } | string>;
      };
    };
  }
}

export {};

export {};

declare global {
  interface PaystackSuccessResponse {
    reference: string;
    status: string;
    trans?: string;
    transaction?: string;
    message?: string;
  }

  interface PaystackSetupOptions {
    key: string;
    email: string;
    amount: number; // kobo
    currency?: string;
    ref: string;
    metadata?: Record<string, unknown>;
    callback: (response: PaystackSuccessResponse) => void;
    onClose: () => void;
  }

  interface PaystackHandler {
    openIframe: () => void;
  }

  interface PaystackPopStatic {
    setup: (options: PaystackSetupOptions) => PaystackHandler;
  }

  interface Window {
    PaystackPop?: PaystackPopStatic;
  }
}

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: 'portrait' | 'landscape';
    };
  }

  interface Html2PdfInstance {
    set: (options: Html2PdfOptions) => Html2PdfInstance;
    from: (element: HTMLElement | null) => Html2PdfInstance;
    toPdf: () => Html2PdfInstance;
    get: (type: string) => Promise<any>;
    save: () => void;
  }

  function html2pdf(): Html2PdfInstance;
  function html2pdf(element: HTMLElement, opts?: Html2PdfOptions): Html2PdfInstance;

  export default html2pdf;
}

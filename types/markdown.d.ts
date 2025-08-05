export interface ContentEntry {
  [key: string]: {
    fields: Record<string, unknown>;
  };
}

export interface HeaderMarkdown {
  menuLabel: string;
  resumeLabel: string;
  menuItems: MenuItem[];
  titles: { [key: string]: string };
}

export interface ErrorMarkdown {
  message: string;
  button: string;
}

type CookieModalSection = {
  title: string;
  description: string;
};

export interface CookieEntry {
  bar: { title: string; description: string };
  modal: {
    title: string;
    intro: string;
    essential: CookieModalSection;
    analytics: CookieModalSection;
    marketing: CookieModalSection;
    footer: string;
  };
}

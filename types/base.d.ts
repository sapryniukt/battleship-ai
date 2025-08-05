type BaseComponent = {
  class?: string;
  [key: string]: unknown;
};

export type ButtonComponentProps = BaseComponent & {
  outline?: boolean;
  type?: "button" | "submit" | "reset";
};

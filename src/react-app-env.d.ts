/// <reference types="react-scripts" />


declare module "body-scroll-lock" {
  export interface BodyScrollOptions {
    reserveScrollBarGap: boolean;
  }

  export function disableBodyScroll(
    targetElement: HTMLElement,
    options?: BodyScrollOptions
  ): void;

  export function enableBodyScroll(targetElement: HTMLElement): void;

  export function clearAllBodyScrollLocks(): void;
}


declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
// types/aframe-jsx.d.ts

// allow importing 'aframe' without @types
declare module 'aframe';

// make this file a module so that `declare global` takes effect
export {};

declare global {
  namespace JSX {
    // common props + allow dash-case attributes like vr-mode-ui / look-controls
    type AFrameTagProps = React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & { [key: string]: any };

    interface IntrinsicElements {
      'a-scene': AFrameTagProps;
      'a-assets': AFrameTagProps;
      'a-entity': AFrameTagProps;
      'a-sky': AFrameTagProps & { src?: string };
      'a-videosphere': AFrameTagProps & { src?: string };
    }
  }
}

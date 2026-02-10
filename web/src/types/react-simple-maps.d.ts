/**
 * Type declarations for react-simple-maps
 * The library doesn't have official TypeScript types
 */

declare module 'react-simple-maps' {
  import { ReactNode, CSSProperties } from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;

  export interface GeographiesProps {
    geography: string | object;
    parseGeographies?: (geographies: any) => any;
    children: (args: { geographies: any[] }) => ReactNode;
  }

  export function Geographies(props: GeographiesProps): JSX.Element;

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    className?: string;
  }

  export function Geography(props: GeographyProps): JSX.Element;

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    style?: CSSProperties;
    className?: string;
  }

  export function Marker(props: MarkerProps): JSX.Element;

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (args: any) => void;
    onMoveEnd?: (args: any) => void;
    onMove?: (args: any) => void;
    children?: ReactNode;
  }

  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
}

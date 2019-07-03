import React, { ComponentType, FC, useMemo } from "react";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

type StylesheetValue = NestedCSSProperties | NestedCSSProperties[];

type PropsToNestedCSSPropertiesFn<P> = (props: P) => StylesheetValue;

export interface IStylesheet<P> {
  [key: string]: StylesheetValue | PropsToNestedCSSPropertiesFn<P>;
}

export interface IClassNames {
  [className: string]: string;
}

function buildClassNames<P, S extends IStylesheet<P>>(props: P, styles: S) {
  const classNames: any = {};

  Object.keys(styles).forEach(className => {
    const value = styles[className];
    const styleProps: StylesheetValue =
      typeof value === "function" ? value(props) : value;

    classNames[className] = Array.isArray(styleProps)
      ? style(...styleProps)
      : style(styleProps);
  });

  return classNames as { [K in keyof S]: string };
}

export interface ITypestyleProps {
  classNames: IClassNames;
}

export function withStyles<P, S extends IStylesheet<P>>(
  styles: S,
  Comp: ComponentType<P & ITypestyleProps>
) {
  const Styled: FC<P> = props => {
    return <Comp {...props} classNames={buildClassNames(props, styles)} />;
  };

  return Styled;
}

export function useWithStyles<P = {}>(
  styles: IStylesheet<P>,
  props: P = {} as P
) {
  return useMemo(() => buildClassNames(props, styles), [
    props,
    buildClassNames
  ]);
}

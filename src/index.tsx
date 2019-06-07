import React, { ComponentType, FC } from "react";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

type PropsToNestedCSSPropertiesFn<P> = (props: P) => NestedCSSProperties;

export interface IStylesheet<P> {
  [key: string]: NestedCSSProperties | PropsToNestedCSSPropertiesFn<P>;
}

export interface IClassNames {
  [className: string]: string;
}

function buildClassNames<P, S extends IStylesheet<P>>(props: P, styles: S) {
  const classNames: any = {};

  Object.keys(styles).forEach(className => {
    const value = styles[className];
    if (typeof value === "function") {
      classNames[className] = style(value(props));
    } else {
      classNames[className] = style(value);
    }
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

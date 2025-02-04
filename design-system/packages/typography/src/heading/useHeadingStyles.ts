import { ClassList, css, tokenSchema, useStyleProps } from '@voussoir/style';
import { HeadingProps, PartialRequired } from '@voussoir/types';

import { getTrimStyles } from '../getTrimStyles';
import { textOptimizationStyles } from '../text/useTextStyles';

export const headingClasses = new ClassList('Heading');

export function useHeadingStyles({
  align,
  size,
  UNSAFE_className,
  ...otherProps
}: PartialRequired<HeadingProps, 'size'>) {
  const fontDefinition = tokenSchema.fontsize.heading[size];
  const trimStyles = getTrimStyles(fontDefinition);
  const styles = [
    {
      color: tokenSchema.color.foreground.neutralEmphasis,
      fontSize: fontDefinition.size,
      fontFamily: tokenSchema.typography.fontFamily.base,
      fontWeight: sizeToWeight[size],
      textAlign: align,
    },
    textOptimizationStyles,
    trimStyles,
  ];

  return useStyleProps({
    ...otherProps,
    UNSAFE_className: [css(styles), UNSAFE_className, headingClasses.root()],
  });
}

const sizeToWeight = {
  small: tokenSchema.typography.fontWeight.semibold,
  regular: tokenSchema.typography.fontWeight.bold,
  medium: tokenSchema.typography.fontWeight.medium,
  large: tokenSchema.typography.fontWeight.bold,
};

import { filterDOMProps, useSlotId } from '@react-aria/utils';
import { DOMProps } from '@react-types/shared';
import { ReactNode, useMemo, useRef } from 'react';

import { checkCircle2Icon } from '@voussoir/icon/icons/checkCircle2Icon';
import { infoIcon } from '@voussoir/icon/icons/infoIcon';
import { alertTriangleIcon } from '@voussoir/icon/icons/alertTriangleIcon';
import { Icon } from '@voussoir/icon';
import { Grid, minmax } from '@voussoir/layout';
import { Content, SlotProvider } from '@voussoir/slots';
import { isReactText, useHasChild } from '@voussoir/utils';
import {
  BaseStyleProps,
  ClassList,
  css,
  tokenSchema,
  useStyleProps,
} from '@voussoir/style';
import { Text } from '@voussoir/typography';

export const noticeClassList = new ClassList('Notice');

const toneToIcon = {
  caution: alertTriangleIcon,
  critical: alertTriangleIcon,
  neutral: infoIcon,
  positive: checkCircle2Icon,
};
const toneToRole = {
  caution: 'alert',
  critical: 'alert',
  neutral: 'status',
  positive: 'status',
};

type NoticeTone = keyof typeof toneToIcon;

// NOTE: this has been a good exploration, and slots will be useful elsewhere,
// but in this case where explicit IDs are required for accessibility and
// composition isn't paramount it may be more appropriate to simply use a
// prop-based API for the heading etc.
export type NoticeProps = {
  children: ReactNode;
  tone?: NoticeTone;
} & BaseStyleProps &
  DOMProps;

/**
 * Use notices to highlight information that affects a section, feature or page.
 * Draw attention without interrupting users from their current task.
 */
export function Notice(props: NoticeProps) {
  const { children, tone = 'neutral', ...otherProps } = props;
  const ref = useRef<HTMLElement | null>(null);
  const styleProps = useStyleProps(otherProps);
  const headingClassName = noticeClassList.declare('heading');
  const headingId = useSlotId();
  const contentId = useSlotId();
  const hasHeading = useHasChild(noticeClassList.selector('heading'), ref);

  const coercedTone = tone === 'neutral' ? 'accent' : tone;
  const icon = toneToIcon[tone];

  const contentStyles = css({
    display: 'grid',
    gap: tokenSchema.size.space.large,
  });

  const slots = useMemo(
    () =>
      ({
        content: {
          elementType: 'div',
          gridArea: hasHeading
            ? 'content'
            : 'heading-start / heading-start / content-end / content-end',
          id: contentId,
          paddingY: hasHeading ? 'regular' : undefined,
          UNSAFE_className: contentStyles,
        },
        heading: {
          elementType: 'div',
          gridArea: 'heading',
          id: headingId,
          UNSAFE_className: headingClassName,
          size: 'small',
        },
        text: { color: coercedTone, weight: 'medium' },
      } as const),
    [
      coercedTone,
      contentId,
      contentStyles,
      hasHeading,
      headingClassName,
      headingId,
    ]
  );

  return (
    <Grid
      aria-live="polite"
      aria-labelledby={headingId}
      aria-describedby={contentId}
      role={toneToRole[tone]}
      ref={ref}
      tabIndex={0}
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
      {...filterDOMProps(otherProps)}
      // appearance
      backgroundColor={coercedTone}
      border={coercedTone}
      borderRadius="medium"
      minWidth={0}
      padding="medium"
      width="100%"
      // layout
      alignItems="center"
      areas={['icon heading', 'icon content']}
      columnGap="medium"
      columns={['icon.medium', 'auto']}
      rows={`${minmax('icon.medium', 'auto')} auto`}
    >
      <Icon
        src={icon}
        size="medium"
        color={coercedTone}
        gridArea="icon"
        alignSelf="start"
      />
      <SlotProvider slots={slots}>
        {isReactText(children) ? (
          <Content>
            <Text>{children}</Text>
          </Content>
        ) : (
          children
        )}
      </SlotProvider>
    </Grid>
  );
}

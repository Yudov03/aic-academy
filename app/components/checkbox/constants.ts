import type { BoxProps, FontSize } from "@aic-kits/react";

export const SIZE_LIST = {
    sm: { box: '14px', text: 'small' as FontSize, gap: 'sm' as BoxProps['gap'], check: '10' },
    md: { box: '16px', text: 'medium' as FontSize, gap: 'md' as BoxProps['gap'], check: '12' },
    lg: { box: '20px', text: 'large' as FontSize, gap: 'lg' as BoxProps['gap'], check: '14' },
};
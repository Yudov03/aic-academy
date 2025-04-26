import type { Space, FontSize } from "@aic-kits/react";
export const SIZE_LIST = {
    sm: { padding: 'xs' as Space, fontSize: 'xs' as FontSize, itemPaddingY: 'xs' as Space, itemPaddingX: 'sm' as Space },
    md: { padding: 'sm' as Space, fontSize: 'small' as FontSize, itemPaddingY: 'sm' as Space, itemPaddingX: 'md' as Space },
    lg: { padding: 'md' as Space, fontSize: 'medium' as FontSize, itemPaddingY: 'md' as Space, itemPaddingX: 'lg' as Space },
};

export const PLACEMENT_LIST = {
    'bottom-start': { top: '100%', left: 0, mt: 'xs' as Space },
    'bottom-end': { top: '100%', right: 0, mt: 'xs' as Space },
    'top-start': { bottom: '100%', left: 0, mb: 'xs' as Space },
    'top-end': { bottom: '100%', right: 0, mb: 'xs' as Space },
};
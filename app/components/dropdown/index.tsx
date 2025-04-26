import {Box, Text, Touchable, type BoxProps, type Color } from '@aic-kits/react';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { SIZE_LIST, PLACEMENT_LIST } from './constants';

type DropdownSize = 'sm' | 'md' | 'lg';

type DropdownOption = {
  value: string;
  label: ReactNode | string;
  onClick?: (value: string) => void;
  disabled?: boolean;
};

interface DropdownProps extends Omit<BoxProps, 'onChange'> {
    trigger: ReactNode;
    items: DropdownOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    color?: Color;
    size?: DropdownSize;
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    dropdownWidth?: string | number;
    triggerWidth?: string | number;
    disabled?: boolean;
    closeOnSelect?: boolean;
}

interface DropdownMenuItemProps {
    item: DropdownOption;
    isSelected: boolean;
    color: Color;
    sizeStyle: typeof SIZE_LIST[DropdownSize];
    onItemClick: (value: string, onClick?: (value: string) => void) => void;
}

function DropdownMenuItem({
    item,
    isSelected,
    color,
    sizeStyle,
    onItemClick,
}: DropdownMenuItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    const hoverBgColor: Color = 'grey100';
    const selectedBgColor: Color = 'white';

    const effectiveBgColor: Color = isSelected
        ? selectedBgColor
        : isHovered && !item.disabled
        ? hoverBgColor
        : 'transparent';

    const effectiveTextColor = isSelected ? color : (item.disabled ? 'grey500' : 'grey900');
    const effectiveFontWeight = isSelected ? 'semibold' : 'regular';

    return (
        <Touchable
            onClick={() => !item.disabled && onItemClick(item.value, item.onClick)}
            style={{ textDecoration: 'none' }}
        >
            <Box
                px={sizeStyle.itemPaddingX}
                py={sizeStyle.itemPaddingY}
                cursor={item.disabled ? 'not-allowed' : 'pointer'}
                bgColor={effectiveBgColor}
                opacity={item.disabled ? 0.6 : 1}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Render the label directly */}
                {typeof item.label === 'string' ? (
                <Text
                    fontSize={sizeStyle.fontSize}
                    color={effectiveTextColor}
                    fontWeight={effectiveFontWeight}
                >
                    {item.label}
                </Text>
                ) : (
                item.label
                )}
            </Box>
        </Touchable>
    );
}

export function Dropdown({
    trigger,
    items,
    value,
    onValueChange,
    color = 'primary',
    size = 'md',
    placement = 'bottom-start',
    dropdownWidth = 'auto',
    triggerWidth = 'auto',
    disabled = false,
    closeOnSelect = true,
    ...rest
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentSizeStyle = SIZE_LIST[size];
    const currentPlacementStyle = PLACEMENT_LIST[placement];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleTriggerClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleItemClick = (itemValue: string, itemOnClick?: (value: string) => void) => {
        if (onValueChange) {
            onValueChange(itemValue);
        }
        if (itemOnClick) {
            itemOnClick(itemValue);
        }
        if (closeOnSelect) {
            setIsOpen(false);
        }
    };

    return (
        <Box position="relative" display="inline-block">
            {/* Trigger Element Wrapper */}
            <Box
                ref={triggerRef}
                onClick={handleTriggerClick}
                display="inline-flex"
                width={triggerWidth}
                justifyContent="space-between"
                alignItems="center"
                b="thin"
                borderColor={disabled ? 'grey300' : 'grey400'}
                borderRadius="md"
                cursor={disabled ? 'not-allowed' : 'pointer'}
                px={currentSizeStyle.itemPaddingX}
                py={currentSizeStyle.itemPaddingY}
                opacity={disabled ? 0.6 : 1}
                {...rest}
            >
                <Box flexGrow={1}>{trigger}</Box>
                <Box ml="sm" display="inline-flex" alignItems="center" flexShrink={0}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </Box>
            </Box>

            {/* Dropdown Panel */}
            {isOpen && (
            <Box
                ref={dropdownRef}
                position="absolute"
                width={dropdownWidth}
                bgColor="white"
                borderRadius="md"
                b="thin"
                borderColor="grey300"
                className="shadow-lg"
                zIndex={10}
                overflow="hidden"
                {...currentPlacementStyle}
                {...rest}
            >
                <Box display="flex" flexDirection="column" py={currentSizeStyle.padding} >
                {items.length > 0 ? (
                    items.map((item) => (
                        <DropdownMenuItem
                            key={item.value}
                            item={item}
                            isSelected={value === item.value}
                            color={color}
                            sizeStyle={currentSizeStyle}
                            onItemClick={handleItemClick}
                        />
                    ))
                ) : (
                    <Box px={currentSizeStyle.itemPaddingX} py={currentSizeStyle.itemPaddingY}>
                    <Text fontSize={currentSizeStyle.fontSize} color="grey500">
                        No options
                    </Text>
                    </Box>
                )}
                </Box>
            </Box>
            )}
        </Box>
    );
}
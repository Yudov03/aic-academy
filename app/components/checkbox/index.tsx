import { Box, Text } from "@aic-kits/react";
import type { BoxProps, Color } from "@aic-kits/react";
import type { ReactNode } from "react";
import { SIZE_LIST } from "./constants";

type CheckboxSize = 'sm' | 'md' | 'lg'; 

interface CheckboxProps extends BoxProps {
  label?: ReactNode; 
  checked: boolean;
  onChange: () => void; 
  disabled?: boolean; 
  color?: Color; 
  size?: CheckboxSize; 
}

export function Checkbox({ 
        label, 
        checked, 
        onChange, 
        disabled = false,
        color = 'primary',
        size = 'md', 
        ...rest 
    }: CheckboxProps) {

    const currentSize = SIZE_LIST[size];
    const boxBgColor = checked ? (disabled ? 'grey300' : color) : 'white';
    const boxBorderColor = checked ? (disabled ? 'grey300' : color) : (disabled ? 'grey300' : 'grey400');
    const checkColor = 'white';
    const labelColor = disabled ? 'grey500' : 'grey900'; 
    const cursor = disabled ? 'not-allowed' : 'pointer';

    return (
        <Box
            display="flex" 
            alignItems="center" 
            gap={currentSize.gap}
            cursor={cursor}
            onClick={() => {
                if (!disabled) { 
                onChange();
                }
            }}
        >
            {/* Hộp vuông checkbox */}
            <Box
                width={currentSize.box}
                height={currentSize.box}
                b="thin" 
                r="xs" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                bgColor={boxBgColor}
                borderColor={boxBorderColor}
                {...rest} 
            >
                {/* Dấu check */}
                {checked && (
                <svg 
                    width={currentSize.check}
                    height={currentSize.check}
                    fill="none" 
                    stroke={checkColor} 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                )}
            </Box>
            { label && <Box>
                {typeof label === 'string' ? (
                    <Text fontSize={currentSize.text} color={labelColor}>
                    {label}
                    </Text>
                ) : (
                    label
                )}
            </Box>}
        </Box>
    );
}
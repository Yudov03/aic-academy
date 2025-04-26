import { Box, Text } from "@aic-kits/react";
import type { BoxProps, Color } from "@aic-kits/react";
import type { ChangeEvent, ReactNode } from "react";
import { useId } from 'react';
import { SIZE_LIST } from "./constants";

type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxProps extends Omit<BoxProps, 'onChange'> {
    /** The content to display next to the checkbox. Can be a string or any React node. */
    label?: ReactNode;
    /** Whether the checkbox is checked. */
    checked: boolean;
    /** Callback function when the checkbox state changes. */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    /** Whether the checkbox is disabled. */
    disabled?: boolean;
    /** The color scheme of the checkbox when checked. Defaults to 'primary'. */
    color?: Color;
    /** The size of the checkbox. Defaults to 'md'. */
    size?: CheckboxSize;
    /** A unique identifier for the input element. If not provided, one will be generated automatically. */
    id?: string;
    /** The name attribute for the input element. */
    name?: string;
    /** The value attribute for the input element. */
    value?: string;
}

/**
 * A custom Checkbox component designed for accessibility.
 * It uses a visually hidden native HTML input element to handle state and interactions,
 * ensuring compatibility with assistive technologies and native browser behavior.
 * The visual appearance is controlled by custom styled Box components.
 */
export function Checkbox({
    label,
    checked,
    onChange,
    disabled = false,
    color = 'primary',
    size = 'md',
    id: providedId,
    name,
    value,
    // Collect remaining BoxProps to apply to the inner flex container
    ...rest
}: CheckboxProps) {

    // Generate a unique ID if none is provided, crucial for associating the label with the input.
    const generatedId = useId();
    const id = providedId || generatedId;

    // --- Style Calculations ---
    const currentSize = SIZE_LIST[size];
    const boxBgColor = checked ? (disabled ? 'grey300' : color) : 'white';
    const boxBorderColor = checked ? (disabled ? 'grey300' : color) : (disabled ? 'grey300' : 'grey400');
    const checkColor = 'white';
    const labelColor = disabled ? 'grey500' : 'grey900';
    const cursor = disabled ? 'not-allowed' : 'pointer';

    return (
        // The <label> element acts as the main container.
        // Using 'htmlFor' links it directly to the hidden input, improving accessibility.
        // Clicking anywhere on the label will toggle the checkbox state.
        <label
            htmlFor={id}
            style={{ cursor: cursor, display: 'inline-block' }} // Basic label styling
        >
            {/* This Box handles the flex layout for the checkbox visual and the label text. */}
            <Box
                display="flex"
                alignItems="center"
                gap={currentSize.gap}
                opacity={disabled ? 0.6 : 1} // Apply disabled opacity to the content wrapper
                {...rest} // Apply any additional BoxProps passed down
            >
                {/*
                 * The native HTML input element is visually hidden but remains functional.
                 * It handles the actual state (checked, disabled) and the onChange event.
                 * This ensures assistive technologies (like screen readers) can correctly
                 * identify and interact with the checkbox.
                 */}
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    style={{
                        // CSS to visually hide the input while keeping it accessible
                        position: 'absolute',
                        opacity: 0,
                        width: 0,
                        height: 0,
                        margin: 0,
                        padding: 0,
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        border: 0,
                    }}
                />

                {/*
                 * This Box represents the visual part of the checkbox (the square).
                 * 'aria-hidden="true"' tells assistive technologies to ignore this element,
                 * as the hidden native input already conveys the necessary information (role, state).
                 */}
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
                    aria-hidden="true"
                >
                    {/* The checkmark icon, shown only when 'checked' is true. */}
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

                {/* Renders the label content if provided. */}
                {label && (
                    <Box>
                        {typeof label === 'string' ? (
                            <Text fontSize={currentSize.text} color={labelColor}>
                                {label}
                            </Text>
                        ) : (
                            // Allows rendering complex React nodes as labels
                            label
                        )}
                    </Box>
                )}
            </Box>
        </label>
    );
}
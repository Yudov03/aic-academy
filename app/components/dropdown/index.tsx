import { Box, Text, type BoxProps, type Color } from '@aic-kits/react';
import {
    useState,
    useRef,
    useEffect,
    ReactNode,
    useId,
    useCallback,
    KeyboardEvent,
} from 'react';
import { SIZE_LIST, PLACEMENT_LIST } from './constants';

// --- Type Definitions ---

type DropdownSize = 'sm' | 'md' | 'lg';

type DropdownOption = {
    value: string;
    label: ReactNode | string;
    onClick?: (value: string) => void;
    disabled?: boolean;
};

interface DropdownMenuItemProps {
    item: DropdownOption;
    isSelected: boolean;
    color: Color;
    sizeStyle: typeof SIZE_LIST[DropdownSize];
    onItemClick: (value: string, onClick?: (value: string) => void) => void;
    id: string; // Unique ID for the option item
    isFocused: boolean; // Whether the item has keyboard focus
    index: number; // Index (mostly for debugging or future use)
}

interface DropdownProps extends Omit<BoxProps, 'onChange' | 'value' | 'defaultValue'> {
    /** The content displayed on the dropdown trigger button. */
    trigger: ReactNode;
    /** An array of options to display in the dropdown menu. */
    items: DropdownOption[];
    /** The currently selected value (for controlled component). */
    value?: string;
    /** Callback function when the selected value changes. */
    onValueChange?: (value: string) => void;
    /** The color scheme. Defaults to 'primary'. */
    color?: Color;
    /** The size of the dropdown. Defaults to 'md'. */
    size?: DropdownSize;
    /** The placement of the dropdown panel relative to the trigger. Defaults to 'bottom-start'. */
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    /** The width of the dropdown panel. Defaults to 'auto'. */
    dropdownWidth?: string | number;
    /** The width of the trigger button. Defaults to 'auto'. */
    triggerWidth?: string | number;
    /** Whether the dropdown is disabled. */
    disabled?: boolean;
    /** Whether the dropdown should close when an item is selected. Defaults to true. */
    closeOnSelect?: boolean;
    /** An accessible label for the trigger button, especially important if the trigger content is not descriptive text (e.g., an icon). */
    triggerLabel?: string;
}

// --- Helper Function ---

/** Finds the last index of an element in an array that satisfies a predicate function. */
function findLastIndex<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => unknown): number {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i], i, array)) {
            return i;
        }
    }
    return -1;
}


// --- DropdownMenuItem Component ---

/**
 * Renders a single item within the dropdown menu.
 * Uses standard `<li>` with ARIA roles for accessibility.
 */
function DropdownMenuItem({
    item,
    isSelected,
    color,
    sizeStyle,
    onItemClick,
    id,
    isFocused,
    // index prop is available if needed
}: DropdownMenuItemProps) {
    // --- Style Calculations ---
    const hoverBgColor: Color = 'grey100'; // Background for focused but not selected item
    const selectedBgColor: Color = 'white'; // Background for selected item

    // Determine background based on selection and focus state
    const effectiveBgColor: Color = isSelected
        ? selectedBgColor
        : isFocused && !item.disabled
        ? hoverBgColor
        : 'transparent';

    // Determine text color based on selection and disabled state
    const effectiveTextColor = isSelected ? color : (item.disabled ? 'grey500' : 'grey900');
    const effectiveFontWeight = isSelected ? 'semibold' : 'regular';

    return (
        // Use `li` element for semantic list item structure.
        // ARIA attributes define its role and state within the listbox.
        <li
            role="option"
            id={id} // Crucial for aria-activedescendant (if used) and general referencing
            aria-selected={isSelected} // Indicates if the item is the currently selected one
            aria-disabled={item.disabled} // Indicates if the item is interactive
            onClick={() => !item.disabled && onItemClick(item.value, item.onClick)}
            style={{ listStyle: 'none', outline: 'none' }} // Reset default list item styles
        >
            {/* Box component handles internal padding, cursor, background, and opacity */}
            <Box
                px={sizeStyle.itemPaddingX}
                py={sizeStyle.itemPaddingY}
                cursor={item.disabled ? 'not-allowed' : 'pointer'}
                bgColor={effectiveBgColor} // Visual feedback for focus/selection
                opacity={item.disabled ? 0.6 : 1}
            >
                {/* Render label content (string or ReactNode) */}
                {typeof item.label === 'string' ? (
                    <Text
                        fontSize={sizeStyle.fontSize}
                        color={effectiveTextColor}
                        fontWeight={effectiveFontWeight}
                    >
                        {item.label}
                    </Text>
                ) : (
                    item.label // Allows rendering complex React nodes
                )}
            </Box>
        </li>
    );
}


// --- Main Dropdown Component ---

/**
 * A custom Dropdown component implementing WAI-ARIA patterns for listbox.
 * Uses a standard HTML <button> as the trigger and a <ul> for the dropdown panel,
 * ensuring semantic structure and keyboard accessibility.
 */
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
    triggerLabel, // Used for aria-label on the button
    ...rest // Spread remaining BoxProps onto the root container
}: DropdownProps) {
    // --- State ---
    const [isOpen, setIsOpen] = useState(false); // Controls visibility of the dropdown panel
    const [focusedIndex, setFocusedIndex] = useState<number>(-1); // Tracks the index of the item with keyboard focus (-1 means no item is focused)

    // --- Refs ---
    const triggerRef = useRef<HTMLButtonElement>(null); // Ref for the trigger button element
    const dropdownRef = useRef<HTMLUListElement>(null); // Ref for the dropdown panel (ul element)

    // --- IDs ---
    // Generate unique IDs for linking ARIA attributes
    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const dropdownId = `${baseId}-dropdown`;
    const getItemId = (index: number) => `${baseId}-item-${index}`;

    // --- Style Lookups ---
    const currentSizeStyle = SIZE_LIST[size];
    const currentPlacementStyle = PLACEMENT_LIST[placement]; // Contains CSS position properties (top, left, mt etc.)

    // --- Effect: Close on Click Outside ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close dropdown if click is outside both trigger and panel
            if (
            isOpen &&
            triggerRef.current &&
            !triggerRef.current.contains(event.target as Node) &&
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
            ) {
            setIsOpen(false);
                setFocusedIndex(-1); // Reset focus index when closing
            }
        };
        // Add listener when dropdown is open
        if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        }
        // Cleanup listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // Re-run effect when isOpen changes

    // --- Event Handler: Trigger Click ---
    const handleTriggerClick = () => {
        if (disabled) return;
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);

        if (nextIsOpen) {
            // When opening, set initial focus to the selected item or the first item
            const selectedIndex = items.findIndex(item => !item.disabled && item.value === value);
            const firstEnabledIndex = items.findIndex(item => !item.disabled);
            const initialFocusIndex = selectedIndex !== -1 ? selectedIndex : (firstEnabledIndex !== -1 ? firstEnabledIndex : -1);

            setFocusedIndex(initialFocusIndex);
            // Scroll the initially focused item into view after the panel renders
             if (initialFocusIndex !== -1) {
                setTimeout(() => {
                    dropdownRef.current?.querySelector(`#${getItemId(initialFocusIndex)}`)?.scrollIntoView?.({ block: 'nearest' });
                }, 0);
            }
        } else {
            // When closing via click, reset focus index
            setFocusedIndex(-1);
        }
    };

    // --- Event Handler: Item Click ---
    const handleItemClick = useCallback((itemValue: string, itemOnClick?: (value: string) => void) => {
        if (onValueChange) {
            onValueChange(itemValue); // Update state for controlled component
        }
        if (itemOnClick) {
            itemOnClick(itemValue); // Execute item-specific onClick handler
        }
        if (closeOnSelect) {
            setIsOpen(false);
            setFocusedIndex(-1);
            triggerRef.current?.focus(); // Return focus to the trigger button after selection
        }
    }, [onValueChange, closeOnSelect]); // Dependencies for useCallback

    // --- Event Handler: Keyboard Navigation ---
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLUListElement>) => {
        if (disabled) return;

        // Get only the non-disabled items for navigation
        const activeItems = items.filter(item => !item.disabled);
        if (!activeItems.length && isOpen) { // Allow Escape even if no active items
             if (event.key === 'Escape') {
                 event.preventDefault();
                 setIsOpen(false);
                 setFocusedIndex(-1);
                 triggerRef.current?.focus();
             }
             return;
        }
         if (!activeItems.length) return; // If no active items and not Escape, do nothing

        // Find the index of the currently focused item within the *activeItems* array
        const currentActiveIndex = activeItems.findIndex(item => items.indexOf(item) === focusedIndex);
        // Get the overall index (in the original `items` array) of the currently focused item
        const currentOverallIndex = focusedIndex;

        const focusItem = (index: number) => {
             if (index !== -1) {
                setFocusedIndex(index);
                dropdownRef.current?.querySelector(`#${getItemId(index)}`)?.scrollIntoView?.({ block: 'nearest' });
             }
        };


        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault(); // Prevent page scroll
                if (!isOpen) {
                    setIsOpen(true); // Open dropdown if closed
                    focusItem(items.indexOf(activeItems[0])); // Focus first active item
                } else {
                    // Calculate next index, wrapping around
                    const nextActiveIndex = (currentActiveIndex + 1) % activeItems.length;
                    focusItem(items.indexOf(activeItems[nextActiveIndex]));
                }
                break;

            case 'ArrowUp':
                event.preventDefault(); // Prevent page scroll
                if (!isOpen) {
                    setIsOpen(true); // Open dropdown if closed
                    focusItem(items.indexOf(activeItems[activeItems.length - 1])); // Focus last active item
                } else {
                     // Calculate previous index, wrapping around
                    const prevActiveIndex = (currentActiveIndex - 1 + activeItems.length) % activeItems.length;
                    focusItem(items.indexOf(activeItems[prevActiveIndex]));
                }
                break;

            case 'Enter':
            case ' ': // Spacebar selects
                event.preventDefault();
                if (isOpen && currentOverallIndex !== -1) {
                    // Select the currently focused item if it's active
                    const focusedItem = items[currentOverallIndex];
                    if (focusedItem && !focusedItem.disabled) {
                        handleItemClick(focusedItem.value, focusedItem.onClick);
                    }
                } else if (!isOpen) {
                    // Open dropdown if closed and Enter/Space is pressed on trigger
                    handleTriggerClick();
                }
                break;

            case 'Escape':
                event.preventDefault();
                if (isOpen) {
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    triggerRef.current?.focus(); // Return focus to trigger
                }
                break;

            case 'Tab':
                // Default Tab behavior is desired: move focus to the next/previous element.
                // Close the dropdown when Tab is pressed while it's open.
                if (isOpen) {
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    // DO NOT preventDefault() here
                }
                break;

            case 'Home':
                event.preventDefault(); // Prevent page scroll
                if (isOpen) {
                    // Focus the first *enabled* item
                     const firstEnabledIndex = items.findIndex(item => !item.disabled);
                     focusItem(firstEnabledIndex);
                }
                break;

            case 'End':
                event.preventDefault(); // Prevent page scroll
                if (isOpen) {
                     // Focus the last *enabled* item
                    const lastEnabledIndex = findLastIndex(items, item => !item.disabled);
                     focusItem(lastEnabledIndex);
                }
                break;

            default:
                // Optional: Implement type-ahead functionality here
                // (Find item starting with the pressed character key)
                break;
        }
    };


    // --- Render ---
    return (
        // Outer Box applies positioning and receives any forwarded BoxProps
        <Box position="relative" display="inline-block" {...rest}>
            {/* Use standard <button> for the trigger for semantic correctness and accessibility */}
            <button
            ref={triggerRef}
                id={triggerId}
            onClick={handleTriggerClick}
                onKeyDown={handleKeyDown} // Handle keyboard interaction on the trigger
                type="button"
                disabled={disabled}
                aria-haspopup="listbox" // Informs AT that this button controls a listbox
                aria-expanded={isOpen} // Informs AT whether the listbox is currently open
                aria-controls={isOpen ? dropdownId : undefined} // Links button to the listbox panel when open
                aria-label={triggerLabel} // Provides an accessible name, vital if `trigger` isn't plain text
                style={{
                    // Reset default button styles
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    font: 'inherit',
                    color: 'inherit',
                    textAlign: 'left',
                    // Apply custom styles
                    width: triggerWidth,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'inline-block', // Needed for width to apply correctly
                }}
            >
                {/* Inner Box handles the visual styling (border, padding, background, layout) */}
                <Box
                    display="inline-flex"
                    width="100%" // Take full width of the button
                    justifyContent="space-between"
                    alignItems="center"
                    b="thin" // Border width
                    borderColor={disabled ? 'grey300' : (isOpen ? color : 'grey400')} // Dynamic border color
                    borderRadius="md" // Border radius
                    px={currentSizeStyle.itemPaddingX} // Horizontal padding
                    py={currentSizeStyle.itemPaddingY} // Vertical padding
                    bgColor="white" // Background color
                >
                    {/* Box for the trigger content passed via props */}
                    <Box flexGrow={1} style={{ pointerEvents: 'none' }}>{trigger}</Box>
                    {/* Box for the dropdown arrow icon */}
                    <Box ml="sm" display="inline-flex" alignItems="center" flexShrink={0} style={{ pointerEvents: 'none' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path></svg>
                    </Box>
            </Box>
            </button>

            {/* Dropdown Panel - Rendered conditionally based on `isOpen` state */}
            {isOpen && (
                // Use standard `ul` for the listbox panel for semantic correctness
                <ul
                ref={dropdownRef}
                    id={dropdownId}
                    role="listbox" // Defines the ARIA role for the container
                    aria-labelledby={triggerId} // Associates the listbox with its controlling button
                    tabIndex={-1} // Allows programmatic focus if needed, but focus usually managed by items/activedescendant
                    onKeyDown={handleKeyDown} // Handle keyboard interactions within the list
                    style={{
                        // --- Positioning and Styling ---
                        position: 'absolute',
                        width: dropdownWidth,
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-md)', // Use CSS variables or adjust as needed
                        border: 'thin solid var(--color-grey300)', // Use CSS variables or adjust
                        zIndex: 10, // Ensure dropdown appears above other content
                        overflowY: 'auto', // Allow scrolling for long lists
                        maxHeight: '200px', // Limit height to prevent excessive length
                        padding: `var(--space-${currentSizeStyle.padding}) 0`, // Vertical padding based on size
                        margin: 0, // Reset default ul margin
                        listStyle: 'none', // Reset default ul list style bullets
                        boxShadow: 'var(--shadow-lg)', // Apply shadow (use variable or explicit value)
                        // Spread placement styles (top, left, right, bottom, mt, mb)
                        ...currentPlacementStyle,
                    }}
                >
                    {/* Map over items to render DropdownMenuItem components or "No options" message */}
                {items.length > 0 ? (
                        items.map((item, index) => (
                            <DropdownMenuItem
                                key={item.value} // Use item value for stable key
                                id={getItemId(index)} // Generate unique ID for the item
                                item={item}
                                isSelected={value === item.value} // Check if this item is the selected one
                                color={color} // Pass down color scheme
                                sizeStyle={currentSizeStyle} // Pass down size styles
                                onItemClick={handleItemClick} // Pass down item click handler
                                isFocused={index === focusedIndex} // Indicate if this item has keyboard focus
                                index={index} // Pass down original index
                            />
                    ))
                ) : (
                        // Display placeholder if no items are provided
                        <li role="option" aria-disabled="true" style={{ listStyle: 'none' }}>
                    <Box px={currentSizeStyle.itemPaddingX} py={currentSizeStyle.itemPaddingY}>
                    <Text fontSize={currentSizeStyle.fontSize} color="grey500">
                        No options
                    </Text>
                    </Box>
                        </li>
                )}
                </ul>
            )}
        </Box>
    );
}
# Summary

## Result

### Checkbox Component Documentation

#### 1. Introduction

The `Checkbox` component is a standard user interface element allowing users to make a binary choice (checked or unchecked). Users can select zero, one, or multiple independent checkboxes within a group.

This component renders an interactive square box that visually represents the checked or unchecked state.

#### 2. Core Components & Anatomy

Visually, the Checkbox component consists of:

*   **The Box:** The square container that visually represents the checkbox.
*   **The Mark:** A checkmark (✓) displayed inside the box when the `checked` prop is `true`.
*   **The Label:** Optional content (text, icon, etc.) displayed next to the box, describing the checkbox's purpose. Clicking the label also toggles the checkbox state.

#### 3. Purpose & Use Cases

Checkboxes are ideal for:

*   **Selecting Multiple Options:** Allowing users to choose any number of items from a list (e.g., filtering by categories or tags).
*   **Making Yes/No Choices:** Representing binary decisions (e.g., "Enable feature?").
*   **Agreeing to Terms:** Indicating acceptance of terms (though often a single checkbox).
*   **Toggling Settings:** Turning specific application settings on or off.

#### 4. API & Props

The `Checkbox` component is configured via props. Key props include:

| Prop       | Type                  | Default     | Description                                                                                       |
| :--------- | :-------------------- | :---------- | :------------------------------------------------------------------------------------------------ |
| `label`    | `ReactNode`           | `undefined` | Optional content displayed next to the checkbox. Clicking it triggers `onChange`.                |
| `checked`  | `boolean`             | `false`     | Determines if the checkbox is currently checked. Managed by parent state (controlled).          |
| `onChange` | `() => void`          | `undefined` | Callback function triggered when the user clicks the checkbox or label (if not disabled).       |
| `disabled` | `boolean`             | `false`     | If `true`, the checkbox is visually muted and non-interactive.                                     |
| `color`    | `Color` (from @aic-kits/react) | `'primary'` | Defines the primary color used for the border and background when checked.                   |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`      | Controls the overall size (box, checkmark, label font size, gap) of the component.             |
| *(BoxProps)* | *(Varies)*            |             | Inherits standard BoxProps from `@aic-kits/react` for layout, spacing, etc., applied to the box. |

*(Note: `Color` type is imported from `@aic-kits/react`.)*

#### 5. Usage Examples

*(Assume relevant imports like `React`, `useState`, and `Checkbox` from `~/components` or your library path)*

**Basic Controlled Checkbox:**

```tsx
import { Checkbox } from '~/components'; // Adjust import path as needed
import { useState } from 'react';
import { Text } from '@aic-kits/react';

function MyComponent() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    // Parent component is responsible for toggling the state
    setIsChecked(prev => !prev);
    // Perform other actions based on the *new* state (!isChecked)
    console.log('Checkbox will be:', !isChecked);
  };

  return (
    <Checkbox
      label={<Text>Subscribe to our newsletter</Text>} // Pass ReactNode as label
      checked={isChecked}
      onChange={handleCheckboxChange}
      color="success" // Example color prop
      size="lg"      // Example size prop
    />
  );
}
```

**Disabled Checkbox:**

```tsx
import { Checkbox } from '~/components';
import { Text } from '@aic-kits/react';

function DisabledExample() {
  return (
    <Checkbox
      label={<Text>This option is unavailable</Text>}
      checked={false} // Or true, depending on the context
      disabled={true}
    />
  );
}
```

#### 6. Accessibility Considerations

*   **Label Association:** Using the `label` prop ensures the text is visually associated. 
*   **Clickable Area:** The component makes both the checkbox box and the label area clickable (if a label is provided), improving usability.
*   **State Communication:** Visually communicates the checked/unchecked state. 

### Dropdown Component Documentation

#### 1. Introduction

The `Dropdown` component provides a way to present a list of options or actions to the user, revealed when they interact with a designated `trigger` element. 

The component manages the opening and closing state of the dropdown panel and handles item selection.

#### 2. Core Components & Anatomy

*   **Trigger:** The visible element (`ReactNode`) provided via the `trigger` prop. The component wraps this trigger in a styled container with a dropdown indicator arrow. Clicking this area opens/closes the dropdown panel.
*   **Dropdown Panel:** A container that appears (usually below or above the trigger based on `placement`) when the dropdown is open. It holds the list of selectable items.
*   **Dropdown Item:** Each individual option or action within the panel, defined by the `items` array. Can be text or complex `ReactNode`.

#### 3. Purpose & Use Cases

Dropdowns are suitable for:

*   **Selecting a Single Option:** Choosing one value from a predefined list (e.g., selecting a sort order, a category).
*   **Form Inputs:** Used as a space-saving alternative to radio buttons or select boxes when there are several options.
*   **Action Menus:** Triggering specific actions associated with each item (e.g., Edit, Delete, View Profile).
*   **Navigation:** Providing secondary navigation links.

#### 4. API & Props

The `Dropdown` component is configured via the following props:

| Prop            | Type                                                            | Default         | Description                                                                                                                                   |
| :-------------- | :-------------------------------------------------------------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger`       | `ReactNode`                                                     | **Required**    | The element displayed as the dropdown's activator.                                                                                            |
| `items`         | `DropdownOption[]`                                              | **Required**    | An array of objects defining the options/actions in the dropdown. See `DropdownOption` structure below.                                      |
| `value`         | `string`                                                        | `undefined`     | The `value` of the currently selected item. Used for controlled selection state.                                                              |
| `onValueChange` | `(value: string) => void`                                       | `undefined`     | Callback function triggered when a user selects an item. Receives the `value` of the selected item.                                            |
| `color`         | `Color` (from @aic-kits/react)                                  | `'primary'`     | Defines the primary color used for styling elements like the selected item text.                                                               |
| `size`          | `'sm' \| 'md' \| 'lg'`                                          | `'md'`          | Controls the overall size (padding, font size) of the dropdown trigger and items.                                                              |
| `placement`     | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'`    | `'bottom-start'` | Determines the position of the dropdown panel relative to the trigger.                                                                         |
| `dropdownWidth` | `string \| number`                                              | `'auto'`        | Sets the width of the dropdown panel.                                                                                                        |
| `triggerWidth`  | `string \| number`                                              | `'auto'`        | Sets the width of the trigger wrapper element.                                                                                                 |
| `disabled`      | `boolean`                                                       | `false`         | If `true`, the entire dropdown trigger is visually muted and cannot be opened. Individual items can also be disabled via `DropdownOption`. |
| `closeOnSelect` | `boolean`                                                       | `true`          | If `true`, the dropdown panel closes automatically after an item is selected.                                                                |
| *(BoxProps)*    | *(Varies)*                                                      |                 | Inherits standard BoxProps from `@aic-kits/react`, applied to the trigger wrapper and dropdown panel for layout, spacing, etc.              |

**`DropdownOption` Structure:**

Each object in the `items` array should follow this structure:

| Prop       | Type                          | Required/Optional | Description                                                                          |
| :--------- | :---------------------------- | :---------------- | :----------------------------------------------------------------------------------- |
| `value`    | `string`                      | Required          | A unique identifier for the option. Passed to `onValueChange` and `item.onClick`.    |
| `label`    | `ReactNode \| string`         | Required          | The content displayed for the item in the dropdown list.                             |
| `onClick`  | `(value: string) => void`     | Optional          | A specific callback function executed when *this particular* item is clicked.        |
| `disabled` | `boolean`                     | Optional          | If `true`, this specific item is visually muted and cannot be selected or clicked. |

*(Note: `Color` type is imported from `@aic-kits/react`.)*

#### 5. Usage Examples

*(Assume relevant imports like `React`, `useState`, `useEffect`, `Dropdown`, `Text`, `Box` from your library/components path)*

**Basic Value Selection:**

```tsx
import { Dropdown } from '~/components'; // Adjust path
import { Text } from '@aic-kits/react';
import { useState } from 'react';

function SortDropdown() {
  const sortOptions = [
    { label: 'Release Date (Newest)', value: 'date_desc' },
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
  ];
  const [currentSort, setCurrentSort] = useState(sortOptions[0].value);

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Select Sort';

  return (
    <Dropdown
      trigger={<Text>{currentLabel}</Text>}
      items={sortOptions}
      value={currentSort}
      onValueChange={(newValue) => setCurrentSort(newValue)}
      dropdownWidth="200px" // Example fixed width
    />
  );
}
```

#### 6. Accessibility Considerations

*   **Visual Communication:** The component visually indicates its state (open/closed) and the selected item (via hover/selection styles).
*   **Mouse Interaction:** Relies primarily on mouse clicks for opening the dropdown (`onClick` on the trigger) and selecting items (`onClick` on `Touchable` wrapper for items).
*   **Outside Click:** Click outsite will close the dropdown panel.

## Process with AI tools 

## Improvements

## Challenges


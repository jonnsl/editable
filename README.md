# Editable

A list interface where the user can add, edit and remove items.

## Demo

Check out the demo [here](https://jonnsl.github.io/editable/)

## Installation

```bash
npm install --save @jonnsl/editable
```

## Examples

Check out the gh-pages branch

## Props

| Props | Type | Default | Description |
| - | - | - | - |
| onChange | (rows: T[]) => void; | undefined | The change event is fired when the user modifies a item. |
| data | T[] | undefined | A list of items. |
| addToBeginning | boolean | false | True if items should be added to the beginning of the list instead of the end of the list. |
| validate | any | - | - |
| colSpan | number | undefined | The number of columns in the table |
| dragAndDrop | boolean | false | True if items can be reordered with drag and drop. |
| readOnly | boolean | false | True if editing should be disabled. |
| locked | boolean | false | True if items cannot be deleted. |
| View | React.ComponentType<ViewProps<T>> | undefined | The component that renders a item. |
| Edit | React.ComponentType<EditProps<T>> | undefined | The component that renders a form to edit a item. |
| EmptyRow | React.ComponentType<EmptyRowProps> | undefined | The component rendered when there is no items. |
| getKey | (row: T) => React.Key | undefined | Function return a unique identifier for a item. |
| defaultData | () => T | undefined | Function returning default data for new items. |
| confirmDelete | string | undefined | Message to confirm the exclusion of an item. |

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

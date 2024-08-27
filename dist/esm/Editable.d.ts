import React, { PureComponent } from 'react';
import { DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot, DropResult, DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
export type EditProps<T> = {
    className: string;
    data: T | null;
    errors: any;
    onKeyDown: (e: KeyboardEvent) => void;
    onChange: (row: T) => void;
};
export type ViewProps<T> = {
    key: React.Key;
    data: T;
    onClick?: (() => void) | undefined;
    innerRef?: ((element: HTMLElement | null) => void) | undefined;
    draggableProps?: DraggableProvidedDraggableProps | undefined;
    dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
    isDragging?: boolean | undefined;
};
export type EmptyRowProps = {};
export type EditableProps<T> = {
    onChange: (rows: T[]) => void;
    data: T[];
    addToBeginning?: boolean;
    validate: any;
    colSpan?: number;
    dragAndDrop?: boolean;
    readOnly?: boolean;
    locked?: boolean;
    View: React.ComponentType<ViewProps<T>>;
    Edit: React.ComponentType<EditProps<T>>;
    EmptyRow: React.ComponentType<EmptyRowProps>;
    getKey: (row: T) => React.Key;
    defaultData: () => T;
    confirmDelete?: string;
};
export type EditableState<T> = {
    adding: T | null;
    editing: T | null;
    edited: T | null;
    errors: any;
};
export default class Editable<T> extends PureComponent<EditableProps<T>, EditableState<T>> {
    state: EditableState<T>;
    constructor(props: EditableProps<T>);
    componentDidMount(): void;
    componentWillUnount(): void;
    onDragEnd: (result: DropResult) => void;
    closeOnEscape: (e: KeyboardEvent) => void;
    addNewRow: () => void;
    saveNewRow: () => void;
    cancelNewRow: () => void;
    saveEdit: () => void;
    cancelEditing: () => void;
    deleteRow: () => void;
    renderRows(): React.JSX.Element | React.JSX.Element[];
    renderViewRow(item: T): (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.JSX.Element;
    renderDroppableBody(provided: DroppableProvided, snapshot: DroppableStateSnapshot): React.JSX.Element;
    renderBody(): React.JSX.Element;
    render(): React.JSX.Element;
}

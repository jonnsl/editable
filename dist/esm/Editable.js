import React, { PureComponent, Fragment } from 'react';
import classnames from 'classnames';
import { arrayDelete, replaceAt } from './Immutable';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { empty, cloneObject, reorder, noop } from './utils';
import ActionButtons from './ActionButtons';
function removeRow(rows, row) {
    const idx = rows.indexOf(row);
    if (idx !== -1) {
        return arrayDelete(rows, idx);
    }
    return rows;
}
export default class Editable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            adding: null,
            editing: null, // The row being edited
            edited: null, // The data of the item being edited
            errors: {},
        };
        this.onDragEnd = (result) => {
            if (!result.destination) {
                return;
            }
            const items = reorder(this.props.data, result.source.index, result.destination.index);
            this.props.onChange(items);
        };
        this.closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                this.setState({
                    adding: null,
                    editing: null,
                    edited: null,
                    errors: {},
                });
            }
        };
        this.addNewRow = () => {
            this.setState({ adding: this.props.defaultData(), editing: null, edited: null, errors: {} });
        };
        this.saveNewRow = () => {
            const { onChange, data, addToBeginning, validate } = this.props;
            const { adding } = this.state;
            if (!onChange || !adding) {
                return;
            }
            if (!validate) {
                return this.setState({
                    adding: null,
                    errors: {},
                }, () => {
                    const rows = [adding];
                    onChange(addToBeginning ? rows.concat(data) : data.concat(adding));
                });
            }
            validate(adding).then((errors) => {
                if (this.state.adding === null) {
                    // Adding was cancelled before the validation finished
                    return;
                }
                this.setState({ errors });
                if (empty(errors)) {
                    this.setState({
                        adding: null,
                    }, () => {
                        const rows = [adding];
                        onChange(addToBeginning ? rows.concat(data) : data.concat(adding));
                    });
                }
            });
        };
        this.cancelNewRow = () => {
            this.setState({ adding: null, errors: {} });
        };
        this.saveEdit = () => {
            const { onChange, data, validate } = this.props;
            const { editing, edited } = this.state;
            if (!onChange || !editing || !edited) {
                return;
            }
            const idx = data.indexOf(editing);
            // assert(idx !== -1)
            if (!validate) {
                return this.setState({
                    editing: null,
                    edited: null,
                    errors: {},
                }, () => onChange(replaceAt(data, idx, edited)));
            }
            validate(edited).then((errors) => {
                if (this.state.editing !== editing) {
                    // editing was cancelled before the validation finished
                    return;
                }
                this.setState({ errors });
                if (empty(errors)) {
                    this.setState({
                        editing: null,
                        edited: null,
                    }, () => onChange(replaceAt(data, idx, edited)));
                }
            });
        };
        this.cancelEditing = () => {
            this.setState({ editing: null, errors: {} });
        };
        this.deleteRow = () => {
            const { onChange, data, confirmDelete } = this.props;
            const { editing } = this.state;
            if (onChange && editing) {
                if (confirmDelete && !window.confirm(confirmDelete)) {
                    return;
                }
                const newData = removeRow(data, editing);
                if (newData !== data) {
                    onChange(newData);
                }
                this.cancelEditing();
            }
        };
        this.renderViewRow = this.renderViewRow.bind(this);
    }
    componentDidMount() {
        window.addEventListener('keydown', this.closeOnEscape);
    }
    componentWillUnount() {
        window.removeEventListener('keydown', this.closeOnEscape);
    }
    renderRows() {
        const { colSpan, dragAndDrop, addToBeginning, readOnly, locked } = this.props;
        const { View, Edit, EmptyRow } = this.props;
        const { getKey, data } = this.props;
        const { adding, editing, edited, errors } = this.state;
        const isDropDisabled = adding !== null || editing !== null;
        if (data.length === 0 && adding === null) {
            return React.createElement(EmptyRow, null);
        }
        const rows = data.map((item, index) => {
            if (editing === item) {
                return (React.createElement(Fragment, { key: getKey(item) },
                    React.createElement(Edit, { className: "active", data: edited, errors: errors, onKeyDown: (e) => e.key === 'Enter' ? (e.preventDefault(), this.saveEdit()) : null, onChange: (row) => this.setState({ edited: row }) }),
                    React.createElement(ActionButtons, { locked: locked, colSpan: colSpan, onConfirm: this.saveEdit, onCancel: this.cancelEditing, onDelete: this.deleteRow })));
            }
            if (dragAndDrop && !readOnly) {
                return (React.createElement(Draggable, { key: getKey(item), draggableId: `EDITABLE_${getKey(item)}`, isDragDisabled: isDropDisabled, index: index }, this.renderViewRow(item)));
            }
            return (React.createElement(View, { key: getKey(item), data: item, onClick: readOnly ? noop : () => this.setState({ editing: item, edited: cloneObject(item) }) }));
        });
        if (adding) {
            const addRow = (React.createElement(Fragment, { key: "__adding" },
                React.createElement(Edit, { className: "active", data: adding, errors: errors, onKeyDown: (e) => e.key === 'Enter' ? (e.preventDefault(), this.saveNewRow()) : null, onChange: (row) => this.setState({ adding: row }) }),
                React.createElement(ActionButtons, { colSpan: colSpan, onConfirm: this.saveNewRow, onCancel: this.cancelNewRow, onDelete: this.cancelNewRow })));
            if (addToBeginning) {
                rows.unshift(addRow);
            }
            else {
                rows.push(addRow);
            }
        }
        return rows;
    }
    renderViewRow(item) {
        const { readOnly } = this.props;
        const { View, getKey } = this.props;
        return (provided, snapshot) => (React.createElement(View, { innerRef: provided.innerRef, draggableProps: provided.draggableProps, dragHandleProps: provided.dragHandleProps, key: getKey(item), data: item, isDragging: snapshot.isDragging, onClick: readOnly ? undefined : () => this.setState({ editing: item, edited: cloneObject(item) }) }));
    }
    renderDroppableBody(provided, snapshot) {
        const { adding, editing } = this.state;
        const tbodyClass = classnames({
            editing: adding || editing,
            'dragging-over': snapshot.isDraggingOver,
        });
        return (React.createElement("tbody", Object.assign({ ref: provided.innerRef }, provided.droppableProps, { className: tbodyClass }),
            this.renderRows(),
            provided.placeholder));
    }
    renderBody() {
        const { adding, editing } = this.state;
        const tbodyClass = classnames({ editing: adding || editing });
        return (React.createElement("tbody", { className: tbodyClass }, this.renderRows()));
    }
    render() {
        const { dragAndDrop } = this.props;
        const { adding, editing } = this.state;
        const isDropDisabled = adding !== null || editing !== null;
        if (dragAndDrop) {
            return (React.createElement(DragDropContext, { onDragEnd: this.onDragEnd },
                React.createElement(Droppable, { droppableId: "table-body", isDropDisabled: isDropDisabled }, this.renderDroppableBody.bind(this))));
        }
        return this.renderBody();
    }
}

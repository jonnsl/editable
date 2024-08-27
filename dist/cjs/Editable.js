"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const Immutable_1 = require("./Immutable");
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const utils_1 = require("./utils");
const ActionButtons_1 = __importDefault(require("./ActionButtons"));
function removeRow(rows, row) {
    const idx = rows.indexOf(row);
    if (idx !== -1) {
        return (0, Immutable_1.arrayDelete)(rows, idx);
    }
    return rows;
}
class Editable extends react_1.PureComponent {
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
            const items = (0, utils_1.reorder)(this.props.data, result.source.index, result.destination.index);
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
                if ((0, utils_1.empty)(errors)) {
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
                }, () => onChange((0, Immutable_1.replaceAt)(data, idx, edited)));
            }
            validate(edited).then((errors) => {
                if (this.state.editing !== editing) {
                    // editing was cancelled before the validation finished
                    return;
                }
                this.setState({ errors });
                if ((0, utils_1.empty)(errors)) {
                    this.setState({
                        editing: null,
                        edited: null,
                    }, () => onChange((0, Immutable_1.replaceAt)(data, idx, edited)));
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
            return react_1.default.createElement(EmptyRow, null);
        }
        const rows = data.map((item, index) => {
            if (editing === item) {
                return (react_1.default.createElement(react_1.Fragment, { key: getKey(item) },
                    react_1.default.createElement(Edit, { className: "active", data: edited, errors: errors, onKeyDown: (e) => e.key === 'Enter' ? (e.preventDefault(), this.saveEdit()) : null, onChange: (row) => this.setState({ edited: row }) }),
                    react_1.default.createElement(ActionButtons_1.default, { locked: locked, colSpan: colSpan, onConfirm: this.saveEdit, onCancel: this.cancelEditing, onDelete: this.deleteRow })));
            }
            if (dragAndDrop && !readOnly) {
                return (react_1.default.createElement(react_beautiful_dnd_1.Draggable, { key: getKey(item), draggableId: `EDITABLE_${getKey(item)}`, isDragDisabled: isDropDisabled, index: index }, this.renderViewRow(item)));
            }
            return (react_1.default.createElement(View, { key: getKey(item), data: item, onClick: readOnly ? utils_1.noop : () => this.setState({ editing: item, edited: (0, utils_1.cloneObject)(item) }) }));
        });
        if (adding) {
            const addRow = (react_1.default.createElement(react_1.Fragment, { key: "__adding" },
                react_1.default.createElement(Edit, { className: "active", data: adding, errors: errors, onKeyDown: (e) => e.key === 'Enter' ? (e.preventDefault(), this.saveNewRow()) : null, onChange: (row) => this.setState({ adding: row }) }),
                react_1.default.createElement(ActionButtons_1.default, { colSpan: colSpan, onConfirm: this.saveNewRow, onCancel: this.cancelNewRow, onDelete: this.cancelNewRow })));
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
        return (provided, snapshot) => (react_1.default.createElement(View, { innerRef: provided.innerRef, draggableProps: provided.draggableProps, dragHandleProps: provided.dragHandleProps, key: getKey(item), data: item, isDragging: snapshot.isDragging, onClick: readOnly ? undefined : () => this.setState({ editing: item, edited: (0, utils_1.cloneObject)(item) }) }));
    }
    renderDroppableBody(provided, snapshot) {
        const { adding, editing } = this.state;
        const tbodyClass = (0, classnames_1.default)({
            editing: adding || editing,
            'dragging-over': snapshot.isDraggingOver,
        });
        return (react_1.default.createElement("tbody", Object.assign({ ref: provided.innerRef }, provided.droppableProps, { className: tbodyClass }),
            this.renderRows(),
            provided.placeholder));
    }
    renderBody() {
        const { adding, editing } = this.state;
        const tbodyClass = (0, classnames_1.default)({ editing: adding || editing });
        return (react_1.default.createElement("tbody", { className: tbodyClass }, this.renderRows()));
    }
    render() {
        const { dragAndDrop } = this.props;
        const { adding, editing } = this.state;
        const isDropDisabled = adding !== null || editing !== null;
        if (dragAndDrop) {
            return (react_1.default.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: this.onDragEnd },
                react_1.default.createElement(react_beautiful_dnd_1.Droppable, { droppableId: "table-body", isDropDisabled: isDropDisabled }, this.renderDroppableBody.bind(this))));
        }
        return this.renderBody();
    }
}
exports.default = Editable;

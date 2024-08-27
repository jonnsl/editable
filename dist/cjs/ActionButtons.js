"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActionButtons;
const react_1 = __importDefault(require("react"));
function ActionButtons(props) {
    const { locked, colSpan, onConfirm, onCancel, onDelete } = props;
    return (react_1.default.createElement("tr", { className: "row-actions" },
        react_1.default.createElement("td", { colSpan: colSpan },
            react_1.default.createElement("div", { className: "editable-actions-outer-container" },
                react_1.default.createElement("div", { className: "editable-actions-container" },
                    react_1.default.createElement("button", { type: "button", className: "btn btn-link", onClick: onConfirm, title: "Confirmar" },
                        react_1.default.createElement("span", { className: "glyphicon glyphicon-ok", "aria-hidden": "true" })),
                    react_1.default.createElement("button", { type: "button", className: "btn btn-link", onClick: onCancel, title: "Cancelar" },
                        react_1.default.createElement("span", { className: "glyphicon glyphicon-remove", "aria-hidden": "true" })),
                    locked
                        ? null
                        : react_1.default.createElement("button", { type: "button", className: "btn btn-link btn-trash", onClick: onDelete, title: "Excluir" },
                            react_1.default.createElement("span", { className: "glyphicon glyphicon-trash", "aria-hidden": "true" })))))));
}

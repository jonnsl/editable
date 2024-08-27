import React from 'react';
export default function ActionButtons(props) {
    const { locked, colSpan, onConfirm, onCancel, onDelete } = props;
    return (React.createElement("tr", { className: "row-actions" },
        React.createElement("td", { colSpan: colSpan },
            React.createElement("div", { className: "editable-actions-outer-container" },
                React.createElement("div", { className: "editable-actions-container" },
                    React.createElement("button", { type: "button", className: "btn btn-link", onClick: onConfirm, title: "Confirmar" },
                        React.createElement("span", { className: "glyphicon glyphicon-ok", "aria-hidden": "true" })),
                    React.createElement("button", { type: "button", className: "btn btn-link", onClick: onCancel, title: "Cancelar" },
                        React.createElement("span", { className: "glyphicon glyphicon-remove", "aria-hidden": "true" })),
                    locked
                        ? null
                        : React.createElement("button", { type: "button", className: "btn btn-link btn-trash", onClick: onDelete, title: "Excluir" },
                            React.createElement("span", { className: "glyphicon glyphicon-trash", "aria-hidden": "true" })))))));
}

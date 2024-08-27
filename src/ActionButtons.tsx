
import React, { MouseEvent } from 'react'

export type ActionButtonsProps = {
  locked?: boolean | undefined;
  colSpan?: number | undefined;
  onConfirm: (e: MouseEvent<HTMLButtonElement>) => void;
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function ActionButtons (props: ActionButtonsProps) {
  const { locked, colSpan, onConfirm, onCancel, onDelete } = props

  return (
    <tr className="row-actions">
      <td colSpan={colSpan}>
        <div className="editable-actions-outer-container">
          <div className="editable-actions-container">
            <button type="button" className="btn btn-link" onClick={onConfirm} title="Confirmar">
              <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-link" onClick={onCancel} title="Cancelar">
              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>
            { locked
              ? null
              : <button type="button" className="btn btn-link btn-trash" onClick={onDelete} title="Excluir">
                <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
              </button> }
          </div>
        </div>
      </td>
    </tr>
  )
}

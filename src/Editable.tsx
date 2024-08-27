
import React, { PureComponent, Fragment } from 'react'
import classnames from 'classnames'
import { arrayDelete, replaceAt } from './Immutable'
import { DragDropContext, Droppable, Draggable, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot, DropResult, DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import { empty, cloneObject, reorder, noop } from './utils'
import ActionButtons from './ActionButtons'

export type EditProps<T> = {
  className: string;
  data: T;
  errors: any;
  onKeyDown: (e: KeyboardEvent) => void;
  onChange: (row: T) => void;
}

export type ViewProps<T> = {
  key: React.Key;
  data: T;
  onClick: (() => void);
  innerRef?: ((element: HTMLElement | null) => void) | undefined;
  draggableProps?: DraggableProvidedDraggableProps | undefined;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
  isDragging?: boolean | undefined;
}

export type EmptyRowProps = {
}

export type EditableProps<T> = {
  onChange: (rows: T[]) => void;
  data: T[];
  addToBeginning?: boolean;
  validate?: any;
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
}

function removeRow<T> (rows: T[], row: T) {
  const idx = rows.indexOf(row)
  if (idx !== -1) {
    return arrayDelete(rows, idx)
  }

  return rows
}

export type EditableState<T> = {
  adding: T | null;
  editing: T | null;
  edited: T | null;
  errors: any;
}

export default class Editable<T> extends PureComponent<EditableProps<T>, EditableState<T>> {
  override state: EditableState<T> = {
    adding: null,
    editing: null, // The row being edited
    edited: null, // The data of the item being edited
    errors: {},
  }

  constructor (props: EditableProps<T>) {
    super(props)
    this.renderViewRow = this.renderViewRow.bind(this)
  }

  override componentDidMount (): void {
    window.addEventListener('keydown', this.closeOnEscape)
  }

  componentWillUnount (): void {
    window.removeEventListener('keydown', this.closeOnEscape)
  }

  onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = reorder(this.props.data, result.source.index, result.destination.index)
    this.props.onChange(items)
  }

  closeOnEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.setState({
        adding: null,
        editing: null,
        edited: null,
        errors: {},
      })
    }
  }

  addNewRow = (): void => {
    this.setState({ adding: this.props.defaultData(), editing: null, edited: null, errors: {} })
  }

  saveNewRow = () => {
    const { onChange, data, addToBeginning, validate } = this.props
    const { adding } = this.state

    if (!onChange || !adding) {
      return
    }

    if (!validate) {
      return this.setState({
        adding: null,
        errors: {},
      }, () => {
        const rows: T[] = [adding];
        onChange(addToBeginning ? rows.concat(data) : data.concat(adding))
      })
    }

    validate(adding).then((errors: any) => {
      if (this.state.adding === null) {
        // Adding was cancelled before the validation finished
        return
      }

      this.setState({ errors })
      if (empty(errors)) {
        this.setState({
          adding: null,
        }, () => {
          const rows: T[] = [adding];
          onChange(addToBeginning ? rows.concat(data) : data.concat(adding))
        })
      }
    })
  }

  cancelNewRow = (): void => {
    this.setState({ adding: null, errors: {} })
  }

  saveEdit = (): void => {
    const { onChange, data, validate } = this.props
    const { editing, edited } = this.state

    if (!onChange || !editing || !edited) {
      return
    }

    const idx = data.indexOf(editing)
    // assert(idx !== -1)

    if (!validate) {
      return this.setState({
        editing: null,
        edited: null,
        errors: {},
      }, () => onChange(replaceAt(data, idx, edited)))
    }

    validate(edited).then((errors: any) => {
      if (this.state.editing !== editing) {
        // editing was cancelled before the validation finished
        return
      }

      this.setState({ errors })
      if (empty(errors)) {
        this.setState({
          editing: null,
          edited: null,
        }, () => onChange(replaceAt(data, idx, edited)))
      }
    })
  }

  cancelEditing = (): void => {
    this.setState({ editing: null, errors: {} })
  }

  deleteRow = (): void => {
    const { onChange, data, confirmDelete } = this.props
    const { editing } = this.state

    if (onChange && editing) {
      if (confirmDelete && !window.confirm(confirmDelete)) {
        return
      }

      const newData = removeRow(data, editing)
      if (newData !== data) {
        onChange(newData)
      }

      this.cancelEditing()
    }
  }

  renderRows () {
    const { colSpan, dragAndDrop, addToBeginning, readOnly, locked } = this.props
    const { View, Edit, EmptyRow } = this.props
    const { getKey, data } = this.props
    const { adding, editing, edited, errors } = this.state
    const isDropDisabled = adding !== null || editing !== null
    if (data.length === 0 && adding === null) {
      return <EmptyRow />
    }

    const rows = data.map((item, index) => {
      if (edited && editing === item) {
        return (
          <Fragment key={getKey(item)}>
            <Edit
              className="active"
              data={edited}
              errors={errors}
              onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' ? (e.preventDefault(), this.saveEdit()) : null}
              onChange={(row: T) => this.setState({ edited: row })}/>
            <ActionButtons
              locked={locked}
              colSpan={colSpan}
              onConfirm={this.saveEdit}
              onCancel={this.cancelEditing}
              onDelete={this.deleteRow} />
          </Fragment>
        )
      }

      if (dragAndDrop && !readOnly) {
        return (
          <Draggable
            key={getKey(item)}
            draggableId={`EDITABLE_${getKey(item)}`}
            isDragDisabled={isDropDisabled}
            index={index}>
            { this.renderViewRow(item) }
          </Draggable>
        )
      }

      return (
        <View
          key={getKey(item)}
          data={item}
          onClick={readOnly ? noop : () => this.setState({ editing: item, edited: cloneObject(item) })} />
      )
    })

    if (adding) {
      const addRow = (
        <Fragment key="__adding">
          <Edit
            className="active"
            data={adding}
            errors={errors}
            onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' ? (e.preventDefault(), this.saveNewRow()) : null}
            onChange={(row: T) => this.setState({ adding: row })} />
          <ActionButtons
            colSpan={colSpan}
            onConfirm={this.saveNewRow}
            onCancel={this.cancelNewRow}
            onDelete={this.cancelNewRow} />
        </Fragment>
      )

      if (addToBeginning) {
        rows.unshift(addRow)
      } else {
        rows.push(addRow)
      }
    }

    return rows
  }

  renderViewRow (item: T) {
    const { readOnly } = this.props
    const { View, getKey } = this.props

    return (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <View
        innerRef={provided.innerRef}
        draggableProps={provided.draggableProps}
        dragHandleProps={provided.dragHandleProps}
        key={getKey(item)}
        data={item}
        isDragging={snapshot.isDragging}
        onClick={readOnly ? noop : () => this.setState({ editing: item, edited: cloneObject(item) })} />
    )
  }

  renderDroppableBody (provided: DroppableProvided, snapshot: DroppableStateSnapshot) {
    const { adding, editing } = this.state
    const tbodyClass = classnames({
      editing: adding || editing,
      'dragging-over': snapshot.isDraggingOver,
    })

    return (
      <tbody ref={provided.innerRef} {...provided.droppableProps} className={tbodyClass}>
        { this.renderRows() }
        { provided.placeholder }
      </tbody>
    )
  }

  renderBody () {
    const { adding, editing } = this.state
    const tbodyClass = classnames({ editing: adding || editing })

    return (
      <tbody className={tbodyClass}>
        { this.renderRows() }
      </tbody>
    )
  }

  override render () {
    const { dragAndDrop } = this.props
    const { adding, editing } = this.state
    const isDropDisabled = adding !== null || editing !== null

    if (dragAndDrop) {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="table-body" isDropDisabled={isDropDisabled}>{ this.renderDroppableBody.bind(this) }</Droppable>
        </DragDropContext>
      )
    }

    return this.renderBody()
  }
}

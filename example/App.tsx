
import './index.css'
import React, { ChangeEvent, Component, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client';
import Editable, { EditProps, ViewProps } from '../src/Editable'
import Text from './Text'
import { Grip } from './Icons'

type TodoListEditableProps = {
}

type TodoListEditableState = {
  rows: Todo[]
}

type Todo = {
  key: string;
  text: string;
}

export default class TodoListEditable extends Component<TodoListEditableProps, TodoListEditableState> {
  addButtonRef: React.RefObject<HTMLElement>
  body: React.RefObject<Editable<Todo>>

  constructor (props: TodoListEditableProps) {
    super(props)
    this.addButtonRef = React.createRef<HTMLElement>()
    this.body = React.createRef<Editable<Todo>>()
    this.state = {
      rows: [
        {key: '1', text: 'Cras tempus rutrum dolor sit amet posuere. Pellentesque laoreet nibh sed velit tempus, vel tincidunt velit posuere. Pellentesque erat nisl, semper non dictum ut, molestie tincidunt dui. Duis ac elit mi.'},
        {key: '2', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mollis elementum massa, sit amet dignissim lacus iaculis nec. Etiam vitae metus est.'},
        {key: '3', text: 'Praesent volutpat sem quis turpis tempus vestibulum. Etiam erat massa, tincidunt eu ultrices volutpat, malesuada vel ipsum. Morbi iaculis consectetur lorem, ut bibendum magna viverra sit amet. Nullam rhoncus sem non ipsum fermentum, at consectetur purus tincidunt.'},
        {key: '4', text: 'Integer non accumsan nisi. Nam sed felis sed dolor mattis lacinia vel eget ipsum.'},
      ],
    }
  }

  focusAddButon () {
    if (this.addButtonRef.current) {
      this.addButtonRef.current.focus()
    }
  }

  render () {
    return (
      <table className="table table-striped table-editable">
        <caption>
          <h4>TODO LIST</h4>
          <AddTodoButton
              innerRef={this.addButtonRef}
              onClick={() => this.body.current?.addNewRow()} />
        </caption>
        <colgroup>
          <col style={{ width: '3%' }} />
          <col style={{ width: '97%' }} />
        </colgroup>
        <Editable<Todo>
          colSpan={2}
          ref={this.body}
          addToBeginning
          dragAndDrop
          confirmDelete="Are you sure that you want to delete this item?"
          View={TodoView}
          Edit={TodoForm}
          EmptyRow={EmptyRow}
          getKey={(item: Todo) => item.key}
          defaultData={createNewTodo}
          data={this.state.rows}
          onChange={(rows: Todo[]) => this.setState({ rows })} />
      </table>
    )
  }
}

function TodoForm ({ className, data, errors, onKeyDown, onChange }: EditProps<Todo>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <tr className={className}>
      <td colSpan={2}>
        <textarea
          ref={textareaRef}
          className="form-control"
          maxLength={5000}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange({ ...data, text: e.target.value })}
          value={data.text}></textarea>
      </td>
    </tr>
  )
}

function TodoView ({ data, onClick, innerRef, draggableProps, dragHandleProps, isDragging }: ViewProps<Todo>) {
  const trClass = isDragging ? 'dragging' : ''

  return (
    <tr
      ref={innerRef}
      className={trClass}
      onClick={(e) => e.button === 0 ? onClick() : null}
      onKeyDown={(e) => e.key === 'Enter' ? (e.preventDefault(), onClick()) : null}
      tabIndex={0}
      {...draggableProps}>
      <td style={{ width: '3%' }}><Grip {...dragHandleProps} /></td>
      <td style={{ width: '97%' }} className="text-justify">
        <Text>{ data.text }</Text>
      </td>
    </tr>
  )
}

function EmptyRow () {
  return (
    <tr>
      <td colSpan={2} className="text-center">
        No Records Found
      </td>
    </tr>
  )
}

function AddTodoButton ({ innerRef, onClick }) {
  return (
    <button type="button" className="btn btn-default" onClick={onClick} ref={innerRef}>
      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
      {' '}Add
    </button>
  )
}

let todo_key = 5;
function createNewTodo (): Todo {
  return {
    key: (todo_key++).toString(),
    text: '',
  }
}

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<TodoListEditable />);

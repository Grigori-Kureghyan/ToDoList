import React from 'react';
import { Checkbox, FormControl } from 'react-bootstrap';

import TodoListItem from '../todo-list-item/todo-list-item';

import './todo-list.css';

const TodoList = ({ items, onToggleImportant, onToggleDone, onDelete, onSelect }) => {

    const elements = items.map((item) => {
        const { id, selected, ...itemProps } = item;
        return (
            <li key={id} className="list-group-item">
                <Checkbox className="col-xs-1 " id={id} value={selected}  onClick={(event) => { onSelect(event)}}/>
                <TodoListItem
                    {...itemProps}
                    onToggleImportant={() => onToggleImportant(id)}
                    onToggleDone={() => onToggleDone(id)}
                    onDelete={() => onDelete(id)}
                    />
            </li>
        );
    });

    return (<ul className="todo-list list-group">{elements}</ul>);
};

export default TodoList;

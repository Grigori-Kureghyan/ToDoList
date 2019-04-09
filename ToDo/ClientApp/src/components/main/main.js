import React, { Component } from 'react';

import AppHeader from '../app-header';
import TodoList from '../todo-list';
import SearchPanel from '../search-panel';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './main.css';


export default class Main extends Component {

    //maxId = 100;

    state = {
        items: [],
        //items: [
        //  { id: 1, label: 'Drink Coffee', important: false, done: false },
        //  { id: 2, label: 'Learn React', important: true, done: false },
        //  { id: 3, label: 'Make Awesome App', important: false, done: false }
        //],
        filter: 'all',
        search: ''
    };

    componentDidMount() {
        this.getToDoItems();
    }

    getToDoItems = () => {
        fetch('api/ToDo', { method: "get" })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    items: data
                });
            });
        //, this.state.items.forEach((item) => { item.selected = false })
    }

    onItemAdded = () => {
        this.getToDoItems();
        //this.setState((state) => {
        //    const item = this.createItem(id, label);
        //    return { items: [...state.items, item] };
        //});
    };

    toggleProperty = (arr, id, propName) => {
        const idx = arr.findIndex((item) => item.id === id);
        const oldItem = arr[idx];
        const value = !oldItem[propName];

        fetch('api/ToDo',
            {
                method: 'Put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: `${id}`, label: oldItem.label, [propName]: value })
            })
            .then((response) => {  
                console.log('Yest Contact');
                    return response.json();               
            });

        const item = { ...arr[idx], [propName]: value };
        return [
            ...arr.slice(0, idx),
            item,
            ...arr.slice(idx + 1)
        ];
    };

    onToggleDone = (id) => {
        
        this.setState((state) => {
            const items = this.toggleProperty(state.items, id, 'done');
            return { items };
        });
    };

    onToggleImportant = (id) => {
        this.setState((state) => {
            const items = this.toggleProperty(state.items, id, 'important');
            return { items };
        });
    };

    onDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) {
            return;
        }

        this.setState({ message: {} });
        fetch('api/ToDo/' + id, { method: 'delete' })
            .then(data => {
                this.setState(
                    {
                        items: this.state.items.filter((rec) => {
                            return rec.Id !== id;
                        })
                    });
                return data.json();
            })
            .then((responseJson) => {
                this.setState((state) => {
                    const idx = state.items.findIndex((item) => item.id === id);
                    const items = [
                        ...state.items.slice(0, idx),
                        ...state.items.slice(idx + 1)
                    ];
                    return { items };
                });
            });
        
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    onSearchChange = (search) => {
        this.setState({ search });
    };

    //createItem(id, label) {
    //    return {
    //        id,
    //        label,
    //        important: false,
    //        done: false
    //    };
    //}

    filterItems(items, filter) {
        if (filter === 'all') {
            return items;
        } else if (filter === 'active') {
            return items.filter((item) => (!item.done));
        } else if (filter === 'done') {
            return items.filter((item) => item.done);
        }
    }

    searchItems(items, search) {
        if (search.length === 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
    }

    
    onSelect = (event) => {       
        const id = event.target.id;
        const newObj = this.state.items;
        newObj.forEach((item) => {
            if (item.id == id) {
                item.selected = !item.selected;
            }
        });        
        this.setState({ items: newObj });
    }

    deleteRows = () => {
        if (!window.confirm('Are you sure you want to delete these tasks?')) {
            return;
        }
        let rows = this.state.items.filter((item) => { return item.selected === true; });
        console.log(rows);

        fetch('api/ToDo/DeleteSelectedItems',
            {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rows)
            })
            .then((response) => {  
                this.getToDoItems();
                return response.json();
            });
    }

    render() {
        const { items, filter, search } = this.state;
        const doneCount = items.filter((item) => item.done).length;
        const toDoCount = items.length - doneCount;
        const visibleItems = this.searchItems(this.filterItems(items, filter), search);

        return (
            <div className="todo-app">
                <AppHeader toDo={toDoCount} done={doneCount} />

                <div className="search-panel d-flex">
                    <SearchPanel
                        onSearchChange={this.onSearchChange} />

                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange} />
                </div>

                <TodoList
                    items={visibleItems}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                    onDelete={this.onDelete}
                    onSelect={this.onSelect}/>

                <ItemAddForm
                    onItemAdded={this.onItemAdded}
                    deleteRows={this.deleteRows}/>
            </div>
        );
    };
}

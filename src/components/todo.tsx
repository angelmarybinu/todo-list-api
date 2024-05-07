import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { v4 as uuidv4 } from 'uuid';
import './todo.css';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
    toggleTodo: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

interface TodoListProps {
    todos: Todo[];
    toggleTodo: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

interface NewTodoFormProps {
    onSubmit: (title: string) => void;
}

function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
    return (
        <ul className="list">
            {todos.length === 0 && <li>No Todos</li>}
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    {...todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                />
            ))}
        </ul>
    );
}

function TodoItem({ id, title, completed, toggleTodo, deleteTodo }: Todo) {
    return (
        <li className={`todo-item ${completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleTodo(id, !completed)}
            />
            <span>{title}</span>
            <button onClick={() => deleteTodo(id)}>Delete</button>
        </li>
    );
}

function NewTodoForm({ onSubmit }: NewTodoFormProps) {
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newItem === '') return;

        onSubmit(newItem);
        setNewItem('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItem(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="new-item-form">
            <div className="form-row">
                <label htmlFor="item">New Item</label>
                <input
                    value={newItem}
                    onChange={handleChange}
                    type="text"
                    id="item"
                />
            </div>
            <button type="submit" className="btn">Add</button>
        </form>
    );
}

function TodoApp() {
    const navigate = useNavigate();
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch('https://jelan.pythonanywhere.com/api/todo?flag=completed');
                if (!response.ok) {
                    throw new Error('Failed to fetch completed todos');
                }
                const data = await response.json();
                setTodos(data.todos);
            } catch (error) {
                console.error('Error fetching completed todos:', error);
            }
        };
        fetchTodos();
    }, []);

    const addTodo = async (title: string) => {
        try {
            const response = await fetch('https://jelan.pythonanywhere.com/api/todo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            const newTodo: Todo = await response.json();
            setTodos(prevTodos => [...prevTodos, newTodo]);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        try {
            const response = await fetch(`https://jelan.pythonanywhere.com/api/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to toggle todo');
            }
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo))
            );
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            const response = await fetch(`https://jelan.pythonanywhere.com/api/todo/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const markSelectedCompleted = async (ids: string[]) => {
        try {
            const formData = new FormData();
            ids.forEach(id => formData.append('ids', id));
            const response = await fetch('https://jelan.pythonanywhere.com/api/todo/markall', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to mark selected todos as completed');
            }
            const updatedTodos = todos.map(todo => ids.includes(todo.id) ? { ...todo, completed: true } : todo);
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error marking selected todos as completed:', error);
        }
    };

    return (
        <>
            <NewTodoForm onSubmit={addTodo} />
            <h1 className="header">My List</h1>
            <button onClick={() => markSelectedCompleted(['1', '2'])}>Mark Selected as Completed</button>
            <TodoList 
                todos={todos} 
                toggleTodo={toggleTodo} 
                deleteTodo={deleteTodo} 
            />
        </>
    );
}

export default TodoApp;

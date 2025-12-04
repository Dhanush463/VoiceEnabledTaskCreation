import React, { useState } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';


const styles = {
    container: {
        padding: '20px',
        paddingBottom: '80px', 
        overflowX: 'hidden',   
    },
    filterContainer: {
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
    },
    input: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        flexGrow: 1,
        minWidth: '150px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    tableHeader: {
        backgroundColor: '#007bff',
        color: 'white',
        textAlign: 'center',
        padding: '12px 10px',
        border: 'none',
        fontSize: '0.9em',
        textTransform: 'uppercase'
    },
    cell: {
        border: '1px solid #eee',
        padding: '10px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '0.95em',
        backgroundColor: 'white', 
    },
    actionButton: (color) => ({
        padding: '6px',
        margin: '0 4px',
        borderRadius: '4px',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        fontSize: '1em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1',
    }),
    priorityBadge: (bgColor, textColor = 'white') => ({
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        backgroundColor: bgColor,
        color: textColor,
    })
};

const TaskTable = ({ tasks, fetchTasks }) => {
    const [filters, setFilters] = useState({
        status: 'All',
        priority: 'All',
        search: ''
    });
    
    const [editMode, setEditMode] = useState({}); 
    const [editingTask, setEditingTask] = useState(null);


    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'High': return styles.priorityBadge('#dc3545'); // Red
            case 'Medium': return styles.priorityBadge('#ffc107', '#333'); // Yellow
            case 'Low': return styles.priorityBadge('#28a745'); // Green
            default: return styles.priorityBadge('#6c757d'); // Gray
        }
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        const params = new URLSearchParams(newFilters).toString();
        await fetchTasks(params);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                fetchTasks(); 
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };
    
    const handleEditStart = (task) => {
        const datePart = task.dueDate 
            ? new Date(task.dueDate).toISOString().split('T')[0] 
            : '';
            
        setEditingTask({ ...task, dueDate: datePart });
        setEditMode({ [task._id]: true });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingTask(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async (id) => {
        try {
            const payload = {
                ...editingTask,
                dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString() : null
            };
            
            await axios.put(`/api/tasks/${id}`, payload);

            console.log('Updated Task Payload:', payload);
            
            setEditMode({}); 
            setEditingTask(null);
            fetchTasks(); 
        } catch (error) {
            console.error('Error updating task:', error.response ? error.response.data : error.message);
            alert(`Failed to update task. Ensure all required fields are filled.`);
        }
    };
    
    const priorityOptions = ['All', 'High', 'Medium', 'Low', 'Urgent']; 
    const statusOptions = ['All', 'To Do', 'In Progress', 'Done'];
    const editStatusOptions = ['To Do', 'In Progress', 'Done'];
    const editPriorityOptions = ['High', 'Medium', 'Low', 'Urgent'];

    return (
        <div style={styles.container}>
            
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
                View All Tasks ({tasks.length})
            </h2>
            
            <div style={styles.filterContainer}>
                
                <input
                    type="text"
                    name="search"
                    placeholder="Search Title or Description..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={styles.input}
                />

                <select name="status" value={filters.status} onChange={handleFilterChange} style={{ ...styles.input, flexGrow: 0 }}>
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt} Status</option>)}
                </select>

                <select name="priority" value={filters.priority} onChange={handleFilterChange} style={{ ...styles.input, flexGrow: 0 }}>
                    {priorityOptions.map(opt => <option key={opt} value={opt}>{opt} Priority</option>)}
                </select>
            </div>

            <table style={styles.table} className="responsive-table">
                <thead>
                    <tr>
                        <th style={{ ...styles.tableHeader, textAlign: 'left' }}>Title</th>
                        <th style={styles.tableHeader}>Priority</th>
                        <th style={styles.tableHeader}>Due Date</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ ...styles.cell, fontStyle: 'italic', color: '#666' }}>
                                No tasks found.
                            </td>
                        </tr>
                    ) : (
                        tasks.map(task => (
                            <tr key={task._id} style={{ backgroundColor: editMode[task._id] ? '#fff3cd' : 'inherit' }}>
                                
                                <td style={{ ...styles.cell, textAlign: 'left' }} data-label="Title">
                                    {editMode[task._id] ? (
                                        <input type="text" name="title" value={editingTask.title} onChange={handleEditChange} style={{ ...styles.input, margin: 0 }} />
                                    ) : (
                                        task.title
                                    )}
                                </td>
                                
                                <td style={styles.cell} data-label="Priority">
                                    {editMode[task._id] ? (
                                        <select name="priority" value={editingTask.priority} onChange={handleEditChange} style={{ ...styles.input, margin: 0 }}>
                                            {editPriorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <span style={getPriorityStyle(task.priority)}>
                                            {task.priority}
                                        </span>
                                    )}
                                </td>
                                
                                <td style={styles.cell} data-label="Due Date">
                                    {editMode[task._id] ? (
                                        <input type="date" name="dueDate" 
                                            value={editingTask.dueDate} 
                                            onChange={handleEditChange} 
                                            style={{ ...styles.input, margin: 0 }}
                                        />
                                    ) : (
                                        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
                                    )}
                                </td>
                                
                                <td style={styles.cell} data-label="Status">
                                    {editMode[task._id] ? (
                                        <select name="status" value={editingTask.status} onChange={handleEditChange} style={{ ...styles.input, margin: 0 }}>
                                            {editStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        task.status
                                    )}
                                </td>
                                
                                <td style={{ ...styles.cell, whiteSpace: 'nowrap' }} data-label="Actions">
                                    {editMode[task._id] ? (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => handleEditSave(task._id)} 
                                                style={styles.actionButton('#28aa46')}
                                                title="Save"
                                            >
                                                <MdSave size={20} />
                                            </button>
                                            <button 
                                                onClick={() => setEditMode({})}
                                                style={styles.actionButton('#6c757d')} 
                                                title="Cancel"
                                            >
                                                <MdClose size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => handleEditStart(task)} 
                                                style={styles.actionButton('#007bff')} 
                                                title="Edit"
                                            >
                                                <MdEdit size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(task._id)}
                                                style={styles.actionButton('#dc3545')} 
                                                title="Delete"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
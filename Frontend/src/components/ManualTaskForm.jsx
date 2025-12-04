import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaTimes, FaCheck } from 'react-icons/fa';

const defaultTask = {
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0] 
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 20px 80px 20px', 
        minHeight: '80vh', 
    },
    formContainer: {
        width: '100%',
        maxWidth: '500px', 
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    fieldGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box',
        marginTop: '3px',
    },
    buttonBase: {
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    primaryButton: {
        backgroundColor: '#007bff', 
        color: 'white',
        marginRight: '10px',
    },
    confirmButton: {
        backgroundColor: '#28a745', 
        color: 'white',
        marginRight: '10px',
    },
    cancelButton: {
        backgroundColor: '#dc3545', 
        color: 'white',
    }
};

const ManualTaskForm = ({ initialData, onSave, onCancelVoice = () => {} }) => {
    
    
    const startingData = initialData || defaultTask; 
    const [task, setTask] = useState(startingData); 

    useEffect(() => {
        setTask(initialData || defaultTask);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', {
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null
            });
            alert('Task saved successfully!');
            setTask(defaultTask); 
            onSave(); 
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to save task.');
        }
    };

    const isVoiceData = initialData && initialData !== defaultTask && initialData.title; 

    const mainButtonStyle = isVoiceData 
        ? {...styles.buttonBase, ...styles.confirmButton} 
        : {...styles.buttonBase, ...styles.primaryButton};

    return (
        <div style={styles.container}> 
            <div style={styles.formContainer}>
                <h2>{isVoiceData ? 'Review Voice Task' : 'Create New Task'}</h2>
                {isVoiceData && <p style={{ color: 'blue', marginBottom: '20px' }}>
                    Please review the parsed data below before confirming the save.
                </p>}
                
                <form onSubmit={handleSubmit}>
                    
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Title:</label>
                        <input type="text" name="title" value={task.title} onChange={handleChange} required style={styles.input} />
                    </div>
                    
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Description:</label>
                        <textarea name="description" value={task.description} onChange={handleChange} style={{ ...styles.input, minHeight: '80px' }} />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Status:</label>
                        <select name="status" value={task.status} onChange={handleChange} required style={styles.input}>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Priority:</label>
                        <select name="priority" value={task.priority} onChange={handleChange} required style={styles.input}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Due Date:</label>
                        <input 
                            type="date" 
                            name="dueDate" 
                            value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''} 
                            onChange={handleChange} 
                            style={styles.input}
                        />
                    </div>
                    
                    <button type="submit" style={mainButtonStyle}>
                        {isVoiceData ? <> <FaSave /> Confirm & Save Task </> : <> <FaSave /> Create Task </>}
                    </button>
                    
                    {isVoiceData && (
                        <button 
                            type="button" 
                            onClick={onCancelVoice} 
                            style={{ ...styles.buttonBase, ...styles.cancelButton }}
                        >
                            <FaTimes /> Cancel Review
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ManualTaskForm;
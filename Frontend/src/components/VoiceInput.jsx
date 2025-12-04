import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { FaMicrophone, FaStop, FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const styles = {
    container: {
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '300',
        marginBottom: '30px',
        color: '#333',
        textAlign: 'center'
    },
    transcript: (isEmpty) => ({
        marginBottom: '25px',
        fontSize: '1.1rem',
        minHeight: '40px',
        color: isEmpty ? '#999' : '#333',
        fontWeight: isEmpty ? 'normal' : '500',
        fontStyle: isEmpty ? 'italic' : 'normal',
        textAlign: 'center',
        padding: '0 10px',
    }),
    reviewTranscriptContainer: { 
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        marginBottom: '20px',
        padding: '10px 0',
    },
    reviewTranscriptHeader: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px'
    },
    reviewTranscriptText: {
        fontSize: '1.1rem',
        fontStyle: 'italic',
        color: '#28a745', 
        padding: '0 10px',
        wordBreak: 'break-word',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80px', 
    },
    micButton: (isListening) => ({
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: isListening ? '#dc3545' : '#007bff', 
        color: 'white',
        fontSize: '2rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s, transform 0.1s',
        animation: isListening ? 'pulse 1.5s infinite' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    formContainer: {
        width: '100%',
        maxWidth: '500px',
        padding: '25px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        marginBottom: '30px',
    },
    formField: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '600',
        color: '#555'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box'
    },
    formButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '25px'
    },
    saveButton: {
        backgroundColor: '#28a745', 
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    cancelButton: {
        backgroundColor: '#6c757d', 
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
};

const TaskConfirmationForm = ({ parsedData, onSubmit, onCancel }) => {
    const [taskData, setTaskData] = useState(parsedData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const formatDateForInput = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const pad = (num) => (num < 10 ? '0' : '') + num;
        
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const finalPayload = {
            ...taskData,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null
        };
        onSubmit(finalPayload);
    };

    return (
        <form onSubmit={handleFormSubmit} style={styles.formContainer}>
            <h5 style={{ fontSize: '1.3rem', fontWeight: '500', marginBottom: '20px', textAlign: 'center' }}>Confirm Task Details</h5>
            
            <div style={styles.formField}>
                <label style={styles.label}>Title (Required)</label>
                <input type="text" name="title" value={taskData.title || ''} onChange={handleChange} required style={styles.input} />
            </div>

            <div style={styles.formField}>
                <label style={styles.label}>Priority</label>
                <select name="priority" value={taskData.priority || 'Medium'} onChange={handleChange} style={styles.input}>
                    {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div style={styles.formField}>
                <label style={styles.label}>Status</label>
                <select name="status" value={taskData.status || 'To Do'} onChange={handleChange} style={styles.input}>
                    {['To Do', 'In Progress', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={styles.formField}>
                <label style={styles.label}>Due Date</label>
                <input 
                    type="datetime-local" 
                    name="dueDate" 
                    value={taskData.dueDate ? formatDateForInput(taskData.dueDate) : ''} 
                    onChange={handleChange} 
                    style={styles.input}
                />
                {taskData.dueDatePhrase && (
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                        *Parsed from: "{taskData.dueDatePhrase}"
                    </p>
                )}
            </div>

            <div style={styles.formButtons}>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>
                    <FaTimes /> Cancel
                </button>
                <button type="submit" style={styles.saveButton}>
                    <FaSave /> Submit & Save
                </button>
            </div>
        </form>
    );
};



const VoiceInput = ({ fetchTasks }) => {
    // mode: 'idle', 'recording', 'parsing', 'reviewing'
    const [mode, setMode] = useState('idle'); 
    const [parsedTask, setParsedTask] = useState(null);
    const [error, setError] = useState(null);

    const { 
        transcript, 
        listening, 
        browserSupportsSpeechRecognition, 
        resetTranscript 
    } = useSpeechRecognition();


    const handleCancel = () => {
        resetTranscript();
        setParsedTask(null);
        setError(null);
        setMode('idle');
    };

    const handleStart = () => {
        setError(null);
        resetTranscript();
        setParsedTask(null); 
        SpeechRecognition.startListening({ continuous: false }); // to stop the recording 
        setMode('recording');
    };

    const initiateParsing = async (currentTranscript) => {
        if (!currentTranscript.trim()) {
            handleCancel();
            return;
        }

        setMode('parsing'); 
        setError(null);

        try {
            const response = await axios.post('/api/voice/parse-voice', { transcript: currentTranscript.trim() });
            
            if (response.data.success) {
                setParsedTask(response.data.parsedData);
                setMode('reviewing');
            } else {
                setError(response.data.message || 'Parsing failed. Please try again.');
                setMode('idle');
            }
        } catch (err) {
            console.error("LLM Parsing API Error:", err);
            setError('Server error during parsing.');
            setMode('idle');
        }
    };

    const handleStopButton = () => {
        SpeechRecognition.stopListening();
    };

    const handleSaveTask = async (taskData) => {
        setMode('parsing'); 
        setError(null);
        try {
            await axios.post('/api/tasks', taskData); 
            
            fetchTasks(); 
            handleCancel(); 
        } catch (err) {
            console.error("Task Save Error:", err.response ? err.response.data : err.message);
            setError('Failed to save task to database.');
            setMode('reviewing'); 
        }
    };


    useEffect(() => {
        if (!listening && mode === 'recording' && transcript.trim()) {
            initiateParsing(transcript);
        }
    }, [listening, mode, transcript]); 

    
    if (!browserSupportsSpeechRecognition) {
        return (
            <p style={{ ...styles.errorBox, backgroundColor: '#fff3cd', color: '#856404' }}>
                <FaExclamationTriangle style={{ marginRight: '5px' }} /> Browser does not support Speech Recognition. Use Chrome or Edge.
            </p>
        );
    }
    

    const renderActionArea = () => {
        if (mode === 'parsing') {
            return (
                <div style={styles.buttonContainer}>
                    <p style={{ color: '#007bff', fontWeight: 'bold' }}>Processing...</p>
                </div>
            );
        }
        
        if (mode === 'recording') {
            return (
                <div style={styles.buttonContainer}>
                    <button 
                        onClick={handleStopButton} 
                        style={{ ...styles.micButton(true), animation: 'pulse 1.5s infinite' }}
                        title="Stop Recording"
                    >
                        <FaStop style={{ fontSize: '1.2rem' }} />
                    </button>
                </div>
            );
        }
        
        return (
            <div style={styles.buttonContainer}>
                <button 
                    onClick={handleStart} 
                    style={styles.micButton(false)}
                    title="Start Recording"
                >
                    <FaMicrophone style={{ fontSize: '1.2rem' }} />
                </button>
            </div>
        );
    };
    

    return (
        <div style={styles.container}>
            <style>
                {`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(220, 53, 69, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
                }
                `}
            </style>
            
            <h4 style={styles.title}>Voice Command Task Creation</h4>
            
            {error && <div style={styles.errorBox}>{error}</div>}
            
            {mode === 'reviewing' && parsedTask ? (
                <>
                    <div style={styles.reviewTranscriptContainer}>
                        <h5 style={styles.reviewTranscriptHeader}>Original Voice Command:</h5>
                        <p style={styles.reviewTranscriptText}>
                            "{transcript}"
                        </p>
                    </div>
                    <TaskConfirmationForm
                        parsedData={parsedTask}
                        onSubmit={handleSaveTask}
                        onCancel={handleCancel}
                    />
                </>
            ) : (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
                    
                    <p style={styles.transcript(!transcript)}>
                        {transcript || 'Press the mic to start speaking...'}
                    </p>
                    
                    {renderActionArea()}
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
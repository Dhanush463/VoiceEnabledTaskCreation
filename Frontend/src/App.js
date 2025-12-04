import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import Navbar from './components/Navbar'; 
import VoiceInput from './components/VoiceInput'; 
import ManualTaskForm from './components/ManualTaskForm'; 
import TaskTable from './components/TaskTable'; 

function App() {
    const [tasks, setTasks] = useState([]);
    const [voiceParsedData, setVoiceParsedData] = useState(null); 
    
    const navigate = useNavigate();

    const fetchTasks = useCallback(async (queryParams = '') => {
        try {
            const response = await axios.get(`/api/tasks?${queryParams}`); 
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    }, []);

    useEffect(() => {
        fetchTasks(); 
    }, [fetchTasks]);

    const handleTaskSaved = () => {
        setVoiceParsedData(null); 
        fetchTasks(); 
        navigate('/view'); 
    };
    
    const handleCancelVoiceReview = () => {
        setVoiceParsedData(null);
        navigate('/create');
    };

    return (
        <div className="App">
            <header style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Voice-Enabled Task Tracker</h1>
            </header>
            
            <div style={{ paddingBottom: '70px' }}> 
                <Routes>
                    <Route 
                        path="/create" 
                        element={
                            <ManualTaskForm 
                                initialData={voiceParsedData} 
                                onSave={handleTaskSaved}
                                onCancelVoice={handleCancelVoiceReview}
                            />
                        } 
                    />
                    
                    <Route 
                        path="/voice" 
                        element={
                            <div style={{ padding: '20px' }}>
                                <VoiceInput fetchTasks={fetchTasks} />
                            </div>
                        } 
                    />

                    <Route 
                        path="/view" 
                        element={<TaskTable tasks={tasks} fetchTasks={fetchTasks} />} 
                    />
                    
                    <Route path="/" element={<p style={{ textAlign: 'center', paddingTop: '50px' }}>Welcome to Voice-Enabled Task Tracker App. Please select a navigation link below to get started!</p>} />
                </Routes>
            </div>

            <Navbar />
        </div>
    );
}

export default App;
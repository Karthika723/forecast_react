import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [forecasts, setForecasts] = useState([]);
    const [newForecast, setNewForecast] = useState({ date: '', temperature: '', description: '' });
    const [editing, setEditing] = useState(false);
    const [currentForecast, setCurrentForecast] = useState({ id: null, date: '', temperature: '', description: '' });

    useEffect(() => {
        fetchForecasts();
    }, []);

    const fetchForecasts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/forecasts');
            setForecasts(response.data);
        } catch (error) {
            console.error('Error fetching forecasts:', error);
        }
    };

    const addForecast = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/forecasts', newForecast);
            setForecasts([...forecasts, response.data]);
            setNewForecast({ date: '', temperature: '', description: '' });
        } catch (error) {
            console.error('Error adding forecast:', error.response ? error.response.data : error.message);
        }
    };

    const deleteForecast = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/forecasts/${id}`);
            setForecasts(forecasts.filter(forecast => forecast.id !== id));
        } catch (error) {
            console.error('Error deleting forecast:', error);
        }
    };

    const editForecast = (forecast) => {
        setEditing(true);
        setCurrentForecast({ id: forecast.id, date: forecast.date, temperature: forecast.temperature, description: forecast.description });
    };

    const updateForecast = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/forecasts/${currentForecast.id}`, currentForecast);
            setForecasts(forecasts.map(forecast => (forecast.id === currentForecast.id ? response.data : forecast)));
            setEditing(false);
            setCurrentForecast({ id: null, date: '', temperature: '', description: '' });
        } catch (error) {
            console.error('Error updating forecast:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="App">
            <h1>Weather Forecasts</h1>
            <div className="input-container">
                {editing ? (
                    <>
                        <input
                            type="date"
                            value={currentForecast.date}
                            onChange={e => setCurrentForecast({ ...currentForecast, date: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Temperature"
                            value={currentForecast.temperature}
                            onChange={e => setCurrentForecast({ ...currentForecast, temperature: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={currentForecast.description}
                            onChange={e => setCurrentForecast({ ...currentForecast, description: e.target.value })}
                        />
                        <button onClick={updateForecast}>Update Forecast</button>
                        <button onClick={() => setEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <input
                            type="date"
                            value={newForecast.date}
                            onChange={e => setNewForecast({ ...newForecast, date: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Temperature"
                            value={newForecast.temperature}
                            onChange={e => setNewForecast({ ...newForecast, temperature: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newForecast.description}
                            onChange={e => setNewForecast({ ...newForecast, description: e.target.value })}
                        />
                        <button onClick={addForecast}>Add Forecast</button>
                    </>
                )}
            </div>
            <ul>
                {forecasts.map(forecast => (
                    <li key={forecast.id}>
                        {forecast.date} - {forecast.temperature}°C - {forecast.description}
                        <button onClick={() => editForecast(forecast)}>Edit</button>
                        <button onClick={() => deleteForecast(forecast.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

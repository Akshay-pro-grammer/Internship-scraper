import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/scrape/${encodeURIComponent(searchTerm)}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="App">
            <h1>Internship Search</h1>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter topic..."
            />
            <button onClick={handleSearch}>Search</button>

            {results.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company Name</th>
                            <th>Location</th>
                            <th>Duration</th>
                            <th>Stipend</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((internship, index) => (
                            <tr key={index}>
                                <td>{internship.jobTitle}</td>
                                <td>{internship.companyName}</td>
                                <td>{internship.location}</td>
                                <td>{internship.duration}</td>
                                <td>{internship.stipend}</td>
                                <td><a href={internship.link} target="_blank" rel="noopener noreferrer">View</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;

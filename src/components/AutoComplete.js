import { useState, useEffect } from 'react';
import '../App.css';

const AutoComplete = () => {
    const [options, setOptions] = useState([]); // State for options fetched from API
    const [value, setValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState(null); // State for handling errors if needed

    // Fetch tags from the backend API when the component mounts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8080/tags');
                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }
                const data = await response.json();
                setOptions(data); // Assuming the API returns an array of objects with {Tname, value}
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTags();
    }, []);

    // Filter the options based on the input value, comparing with Tname field
    const suggestions = options.filter(option =>
        option.Tname.toLowerCase().includes(value.toLowerCase())
    );

    const handleChange = (e) => {
        setValue(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setValue(suggestion.Tname); // Use Tname for display
        setShowSuggestions(false);
    };

    return (
        <div className="AutoCompleteContainer">
            <input
                type="text" id="tags"
                style={{ backgroundColor: 'transparent', border: 'none', margin: '0px' }}
                placeholder="Search Tags"
                value={value}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && (
                <ul>
                    {/* Mapping suggestions to display a list */}
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <li 
                                key={index} // Use index if values are non-unique, otherwise use a unique identifier
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ cursor: 'pointer', padding: '5px' }}
                            >
                                {suggestion.Tname} {/* Display the Tname */}
                            </li>
                        ))
                    ) : (
                        <li>No suggestions found</li>
                    )}
                </ul>
            )}
            {error && <div className="error">{error}</div>} {/* Display error if any */}
        </div>
    );
};

export default AutoComplete;

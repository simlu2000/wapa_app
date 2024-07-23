import { eventWrapper } from "@testing-library/user-event/dist/utils";
import React, {useState} from "react";
import { Helmet } from 'react-helmet';

const SearchLocation = ({onSearch}) => {
    const [input, setInput] = useState(''); //per stato input che si aggiorna
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    const handleSearch = () => {
        onSearch(input);
    };

    return (
        <>
            <Helmet>
                <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" />
            </Helmet>
            <div className="box-search">
                <div className="container-1">
                    <span className="icon" onClick={handleSearch}><i className="fa fa-search"></i></span>
                    <input
                        id="search-location"
                        type="text"
                        placeholder="Type a location..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    ></input>
                </div>
            </div>

        </>
    )
}

export default SearchLocation;
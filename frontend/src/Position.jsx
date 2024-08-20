import React, { useEffect, useState } from "react";
import axios from "axios";

const Position = () => {
    const [position, setPosition] = React.useState({});

    useEffect(() => {
        // get id from url
        const id = window.location.pathname.split("/").pop();

        // fetch position by id
        axios.get(`http://localhost:8000/api/positions/${id}`)
            .then(response => {
                if (response.status === 200) {
                    setPosition(response.data.position);
                }
            });
    }, []);

    return (
        <div id="position">
            <h1>Position</h1>
            <p>{position.name}</p>
            <p>{position.location}</p>
            <p>{position.datePosted}</p>
            <p>{position.numberOfApplicants}</p>
        </div>
    );
}

export default Position;
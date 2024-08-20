import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "axios";

const Position = observer(() => {
    const [position, setPosition] = React.useState({});

    useEffect(() => {
        // get id from url
        const id = window.location.pathname.split("/").pop();

        // fetch position by id
        axios.get(`http://localhost:8000/api/positions/${id}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.position);
                    // set position
                }
            });
    }, []);

    return (
        <div>
            <h1>Position</h1>
            <p>{position.name}</p>
            <p>{position.location}</p>
            <p>{position.datePosted}</p>
            <p>{position.numberOfApplicants}</p>
        </div>
    );
})

export default Position;
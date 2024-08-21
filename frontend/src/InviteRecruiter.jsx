import { Button, Modal } from "@mui/material";
import React from "react";
import axios from "axios";

const InviteRecruiter = () => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    const addRecruiter = () => {
        axios.post('http://localhost:8000/api/add-recruiters/', {
            recruiters: selected,
        })
            .then(response => {
                if (response.status === 200) {
                    setOpen(false);
                    setSearch('');
                    setSelected([]);
                }
            })
            .catch(error => {
                console.error("Error adding recruiters:", error);
            })
            .finally(() => {
                //window.location.reload();
            });
    }

    const updateSearch = (e) => {
        setSearch(e.target.value);

        axios.get('http://localhost:8000/api/recruiters?search=' + e.target.value)
            .then(response => {
                if (response.status === 200) {
                    setResults(response.data.recruiters);
                }
            })
            .catch(error => {
                console.error("Error fetching recruiters:", error);
            });
    }

    return (
        <>
            <Button
                id="invite-recruiter"
                variant="contained"
                onClick={() => {
                    setOpen(true);
                }}
            >
                Invite Recruiter
            </Button>

            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setSearch('');
                }}
            >
                <div
                    id="invite-recruiter-modal"
                >
                    <h1>Add Recruiter</h1>
                    <input
                        value={search}
                        placeholder="Recruiter's name"
                        type="text"
                        onChange={e => updateSearch(e)}
                    />
                    <div>
                        {results.map((result, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (selected.includes(result.id)) {
                                            setSelected(selected.filter(res => res.id !== result.id));
                                        } else {
                                            setSelected([...selected, {
                                                id: result.id,
                                                isRecruiter: result.isRecruiter,
                                            }]);
                                        }
                                    }}
                                    style={{
                                        background: selected.filter(item => item.id === result.id).length > 0 ? '#73d0b9' : 'none',
                                        color: selected.filter(item => item.id === result.id).length > 0 ? 'white' : '#73d0b9',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold' }}>{result.name} ({result.email})</span>
                                </div>
                            );
                        })}
                    </div>
                    <Button
                        onClick={addRecruiter}
                        variant="contained"
                    >
                        Add
                    </Button>
                </div>
            </Modal >
        </>
    );
}

export default InviteRecruiter;
import React, { useEffect, useMemo } from "react";
import axios from "axios";
import store from "./store";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Formik } from "formik";

const CompleteProfile = observer(() => {
    const [account, setAccount] = React.useState({});

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/client`)
            .then(response => {
                if (response.status === 200) {
                    setAccount(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const validate = values => {
        const errors = {};

        if (!values.name) errors.name = "Required";

        return errors;
    }

    const handleSubmit = (values, { setSubmitting }) => {
        axios.patch(`http://localhost:8000/api/client/`, values)
            .then(response => {
                let updatedAccount = { ...account };
                if (response.status === 200) {
                    for (let key in values) {
                        updatedAccount[key] = values[key];
                    }

                    store.setUser(updatedAccount);

                    navigate('/');
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    return (
        <main id="complete-profile">
            <div></div>
            <div>
                <Formik
                    initialValues={{
                        name: '',
                        location: '',
                        website: '',
                        phone: '',
                    }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                autoComplete="off"
                                spellCheck="false"
                            />
                            <span className="error">
                                {errors.name && touched.name && errors.name}
                            </span>

                            <div>
                                <button type="submit" disabled={isSubmitting}>
                                    Save
                                </button>
                                <button type="submit" disabled={isSubmitting}>
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </main>
    );
});

export default CompleteProfile;
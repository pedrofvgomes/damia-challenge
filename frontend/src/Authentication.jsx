import React, { useEffect } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Authentication = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        
    }, []);

    const validate = values => {
        const errors = {};

        if (isLogin) {
            if (!values.username) errors.username = 'Required';
            if (!values.password) errors.password = 'Required';
        } else {
            if (!values.username) errors.username = 'Required';
            if (!values.password) errors.password = 'Required';
            if (!values.confirmPassword) errors.confirmPassword = 'Required';
            if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = (values, { setSubmitting }) => {
        axios.defaults.withCredentials = true;

        const endpoint = isLogin ? '/api/login/' : '/api/register/';
        let data = { username: values.username, password: values.password };
        if (!isLogin) data.confirm_password = values.confirmPassword;

        axios.post(`http://localhost:8000${endpoint}`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    if (isLogin)
                        navigate('/');
                }
            })
            .catch(error => alert('Error: ' + error.response?.data?.error || 'An error occurred'))
            .finally(() => setSubmitting(false));
    };

    return (
        <main id="authentication">
            <div></div>
            <div>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        confirmPassword: ''
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
                            {isLogin ? (
                                <>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.username}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <span className="error">
                                        {errors.username && touched.username && errors.username}
                                    </span>

                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                    />
                                    <span className="error">
                                        {errors.password && touched.password && errors.password}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.username}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <span className="error">
                                        {errors.username && touched.username && errors.username}
                                    </span>

                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                    />
                                    <span className="error">
                                        {errors.password && touched.password && errors.password}
                                    </span>

                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.confirmPassword}
                                    />
                                    <span className="error">
                                        {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                                    </span>
                                </>
                            )}

                            <button type="submit" disabled={isSubmitting}>
                                Submit
                            </button>

                            <h4>
                                {isLogin ? 'Need to create an account?' : 'Already have an account?'}
                                <span
                                    onClick={() => {
                                        resetForm();
                                        setIsLogin(!isLogin);
                                    }}
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                >
                                    {isLogin ? ' Register' : ' Login'}
                                </span>
                            </h4>
                        </form>
                    )}
                </Formik>
            </div>
        </main>
    );
}

export default Authentication;

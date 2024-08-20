import React, { useEffect } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Authentication = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const navigate = useNavigate();

    useEffect(() => {}, []);

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
            if (!values.firstName) errors.firstName = 'Required';
            if (!values.lastName) errors.lastName = 'Required';
            if (!values.email) errors.email = 'Required';
        }

        return errors;
    };

    const handleSubmit = (values, { setSubmitting }) => {
        axios.defaults.withCredentials = true;

        const endpoint = isLogin ? '/api/login/' : '/api/register/';
        let data = { username: values.username, password: values.password };
        if (!isLogin) {
            data = {
                ...data,
                confirm_password: values.confirmPassword,
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email
            };
        }

        axios.post(`http://localhost:8000${endpoint}`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    if (isLogin)
                        alert('Logged in successfully');
                    else
                        alert('Account created successfully');
                    
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
                        confirmPassword: '',
                        firstName: '',
                        lastName: '',
                        email: ''
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
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.firstName}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <span className="error">
                                        {errors.firstName && touched.firstName && errors.firstName}
                                    </span>

                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastName}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <span className="error">
                                        {errors.lastName && touched.lastName && errors.lastName}
                                    </span>

                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <span className="error">
                                        {errors.email && touched.email && errors.email}
                                    </span>

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

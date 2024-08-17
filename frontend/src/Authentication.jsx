import React from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import './App.css';

// workaround for Django CSRF token
function getCsrfToken() {
    const name = 'csrftoken=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

const Authentication = () => {
    const [isLogin, setIsLogin] = React.useState(true);

    // Validation function
    const validate = values => {
        const errors = {};

        if (isLogin) {
            // Login validation
            if (!values.username) errors.username = 'Required';
            else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.username) &&
                !/^[a-zA-Z0-9_]+$/.test(values.username)
            ) errors.username = 'Invalid username.';

            if (!values.password) errors.password = 'Required';
            else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters long';
        } else {
            // Registration validation
            if (!values.username) errors.username = 'Required';
            else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) errors.username = 'Invalid username.';
            if (!values.password) errors.password = 'Required';
            else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters long';

            if (!values.confirmPassword) errors.confirmPassword = 'Required';
            else if (values.confirmPassword.length < 8) errors.confirmPassword = 'Password must be at least 8 characters long';
            else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    // Submit handler
    const handleSubmit = (values, { setSubmitting }) => {
        axios.defaults.withCredentials = true;

        const endpoint = isLogin ? '/api/login/' : '/api/register/';
        let data = {
            username: values.username,
            password: values.password,
        };
        if (!isLogin) data.confirm_password = values.confirmPassword;

        axios.post(`http://localhost:8000${endpoint}`, data, {
            headers: {
                'X-CSRFToken': getCsrfToken(),
                'Content-Type': 'application/json'
            }
        })
            .then(response => alert('Success: ' + response.data.message))
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
                                        resetForm()
                                        setIsLogin(!isLogin)
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
};

export default Authentication;

import React from "react";
import { Formik } from 'formik';
import './App.css';

const Authentication = () => {
    const [isLogin, setIsLogin] = React.useState(true);

    return (
        <main id="authentication">
            <div>

            </div>
            <div>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: '' // only used for registration
                    }}
                    validate={values => {
                        const errors = {};

                        // Email validation
                        if (!values.email) errors.email = 'Required';
                        else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) errors.email = 'Invalid email address';

                        // Password individual validation
                        if (!values.password) errors.password = 'Required';
                        else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters long';

                        // Confirm password individual validation
                        if (!values.confirmPassword && !isLogin) errors.confirmPassword = 'Required';
                        else if (values.confirmPassword.length < 8 && !isLogin) errors.confirmPassword = 'Password must be at least 8 characters long';

                        // Password matching
                        if (values.password !== values.confirmPassword && !isLogin) errors.confirmPassword = 'Passwords do not match';

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        alert(':)')
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            />
                            <span className="error">
                                {errors.email && touched.email && errors.email}
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

                            {!isLogin && (
                                <>
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
                                    onClick={() => setIsLogin(!isLogin)}
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
    )
}

export default Authentication;
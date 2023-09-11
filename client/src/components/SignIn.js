import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../context/UserAuthProvider";

function SignIn() {

  const { handleAuthSubmit, error } = useUserAuth();

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Please Log In!</h2>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={(values, actions) => {
          handleAuthSubmit(values, actions, "SignIn");
              
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Log In"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignIn;

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../context/UserAuthProvider";
import "./FormStyles.css"; // Import your CSS file for styling
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import the VisibilityOff icon

function SignIn({ toggleSignupModal }) {
  const { handleAuthSubmit, error } = useUserAuth();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h2>Please Log In!</h2>
      {error && <p className="error-message">{error}</p>}
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
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <Field
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                />
                {showPassword ? (
                  <VisibilityOff
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                ) : (
                  <Visibility
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </div>
              <ErrorMessage name="password" />
            </div>
            <div className="form-group">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Log In"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <p>
        Don't have an account?{" "}
        <span onClick={toggleSignupModal} style={{ cursor: "pointer", color: "#142e60", fontWeight: 'bold' }}>
          Create Account
        </span>
      </p>
    </div>
  );
}

export default SignIn;
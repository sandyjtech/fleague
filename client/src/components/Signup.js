import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../context/UserAuthProvider";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import VisibilityOff icon

function Signup({ toggleSignInModal }) {
  const { signUp, handleAuthSubmit, handleClick, error } = useUserAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Please Sign Up!</h2>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters long.")
            .matches(
              /[A-Z]/,
              "Password must contain at least one uppercase letter."
            )
            .matches(/[0-9]/, "Password must contain at least one digit.")
            .matches(
              /[!@#$%^&*()_\-+=<>?/~.]/,
              "Password must contain at least one special character."
            ),
          confirmPassword: signUp
            ? Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required")
            : Yup.string(),
          space: Yup.string(),
          email: signUp
            ? Yup.string()
                .email("Invalid email address")
                .required("Email is required")
            : Yup.string(),
        })}
        onSubmit={(values, actions) => {
          handleAuthSubmit(values, actions, "signup");
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
              <label htmlFor="email">Email</label>
              <Field type="text" id="email" name="email" />
              <ErrorMessage name="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <Field
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                />
                {showPassword ? (
                  <VisibilityOff
                    onClick={togglePasswordVisibility}
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
                    onClick={togglePasswordVisibility}
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
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="current-password"
                />
                {showConfirmPassword ? (
                  <VisibilityOff
                    onClick={toggleConfirmPasswordVisibility}
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
                    onClick={toggleConfirmPasswordVisibility}
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
              <ErrorMessage name="confirmPassword" />
            </div>

            <p>
              Already a member?{" "}
              <span
                onClick={toggleSignInModal}
                style={{
                  cursor: "pointer",
                  color: "#142e60",
                  fontWeight: "bold",
                }}
              >
                Log In!
              </span>
            </p>
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;

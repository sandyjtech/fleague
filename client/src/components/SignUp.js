import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../context/UserAuthProvider";
import VisibilityIcon from '@mui/icons-material/Visibility';


function Signup({onSignup}) {
  const { signUp, handleAuthSubmit, handleClick, error } = useUserAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();;

  const spaceOptions = [
    "Owned-Home with no yard",
    "Owned-Home with yard",
    "Lease-Home with no yard",
    "Leased-Home with yard",
  ];



  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Please Sign Up!</h2>
      <p>
        Already a member? <span onClick={handleClick}>Log In!</span>
      </p>
      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
          address: "",
          small_kids: false,
          own_pets: false,
          space: "",
          email: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters long.")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
          .matches(/[0-9]/, "Password must contain at least one digit.")
          .matches(/[!@#$%^&*()_\-+=<>?/~.]/, "Password must contain at least one special character."),
          confirmPassword: signUp
            ? Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required")
            : Yup.string(),
          address: Yup.string().required("Address is required"),
          small_kids: Yup.boolean(),
          own_pets: Yup.boolean(),
          space: Yup.string(),
          email: signUp
            ? Yup.string()
                .email("Invalid email address")
                .required("Email is required")
            : Yup.string(),
        })}
        onSubmit={(values, actions) => {
          handleAuthSubmit(values, actions, "signup");
          navigate.push("/profile/:id");     
       
          onSignup();
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
              <Field
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
              />
              <VisibilityIcon
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              />
              <ErrorMessage name="password" />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="current-password"
              />
              <VisibilityIcon
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer" }}
              />
              <ErrorMessage name="confirmPassword" />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <Field type="text" id="address" name="address" />
              <ErrorMessage name="address" />
            </div>
            <div>
              <label htmlFor="small_kids">Small Kids</label>
              <Field type="checkbox" id="small_kids" name="small_kids" />
            </div>
            <div>
              <label htmlFor="own_pets">Own Pets</label>
              <Field type="checkbox" id="own_pets" name="own_pets" />
            </div>
            <div>
              <label htmlFor="space">Space</label>
              <Field as="select" id="space" name="space">
                <option value="">Select space option</option>
                {spaceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="space" />
            </div>
            {signUp && (
              <div>
                <label htmlFor="email">Email</label>
                <Field type="text" id="email" name="email" />
                <ErrorMessage name="email" />
              </div>
            )}
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


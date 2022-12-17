import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

const SignUp = (props) => {
  const [isSubmitted, setSubmitted] = useState(false);
  const onSubmit = async (values, actions) => {
    const url = `http://localhost:8009/api/sign_up/`;
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("password1", values.password1);
    formData.append("password2", values.password2);
    try {
      await axios.post(url, formData);
      setSubmitted(true);
    } catch (response) {
      const data = response.response.data;
      for (const value in data) {
        actions.setFieldError(value, data[value].join(" "));
      }
    }
  };

  if (props.isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (isSubmitted) {
    return <Navigate to="/log-in" />;
  }

  const signupSchema = Yup.object().shape({
    password1: Yup.string()
      .min(8, "Password too short!")
      .max(50, "Password too long!")
      .required("Required"),
    password2: Yup.string().oneOf(
      [Yup.ref("password1"), null],
      "Passwords must match"
    ),
    first_name: Yup.string()
      .max(50, "First name too long!")
      .required("Required"),
    last_name: Yup.string().max(50, "Last Name too long!").required("Required"),
    username: Yup.string().max(50, "Username too long!").required("Required"),
  });

  return (
    <div class="flex h-screen w-full place-content-center items-center bg-bgb pt-20 pb-16 text-bwh">
      <div class="flex h-auto w-[360px] flex-col justify-center rounded-2xl bg-bg1 px-4">
        <h1 class="self-center pt-6 pb-8 text-xl">
          Join <span class="text-2xl font-bold tracking-wide">MovieHand</span>
        </h1>
        <Formik
          initialValues={{
            username: "",
            password1: "",
            password2: "",
            first_name: "",
            last_name: "",
          }}
          validationSchema={signupSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => {
            return (
              <Form class="flex flex-col self-center font-body">
                <label class="flex w-60 flex-col pb-5">
                  Username:{" "}
                  <Field
                    id="username"
                    type="text"
                    name="username"
                    class="h-8 rounded-lg border border-bg2 bg-bg1 px-3 text-lg"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <label class="flex w-60 flex-col pb-5">
                  First name:{" "}
                  <Field
                    id="firstname"
                    type="text"
                    name="first_name"
                    class="h-8 rounded-lg border border-bg2 bg-bg1 px-3 text-lg"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <label class="flex w-60 flex-col pb-5">
                  Last name:{" "}
                  <Field
                    id="lastname"
                    type="text"
                    name="last_name"
                    class="h-8 rounded-lg border border-bg2 bg-bg1 px-3 text-lg"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <label class="flex flex-col pb-5">
                  Choose password:
                  <Field
                    id="password1"
                    type="password"
                    name="password1"
                    class="h-8 rounded-lg border border-bg2 bg-bg1 px-3 text-lg"
                  />
                  <ErrorMessage
                    name="password1"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <label class="flex flex-col pb-5">
                  Confirm password:
                  <Field
                    id="password2"
                    type="password"
                    name="password2"
                    class="h-8 rounded-lg border border-bg2 bg-bg1 px-3 text-lg"
                  />
                  <ErrorMessage
                    name="password2"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <button
                  id="signup"
                  type="submit"
                  class="mt-2 mb-3 w-32 self-center rounded-2xl bg-bgb p-3 hover:bg-bg2"
                  disabled={isSubmitting}
                >
                  Sign up
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;

import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

const LogIn = (props) => {
  const [isSubmitted, setSubmitted] = useState(false);
  const onSubmit = async (values, actions) => {
    try {
      await props.logIn(values.username, values.password);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (props.isLoggedIn || isSubmitted) {
    return <Navigate to="/" />;
  }

  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password too short!")
      .max(50, "Password too long!")
      .required("Required"),
    username: Yup.string().max(50, "Username too long!").required("Required"),
  });

  return (
    <div class="flex h-screen w-full place-content-center items-center bg-bgb pt-20 pb-16 text-bwh">
      <div class="flex h-[450px] w-[360px] flex-col justify-center rounded-2xl bg-bg1 px-4">
        <h1 class="self-center pb-14 text-xl">
          Log in to{" "}
          <span class="text-2xl font-bold tracking-wide">MovieHand</span>
        </h1>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={loginSchema}
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
                <label class="flex flex-col pb-5">
                  Password:
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    class="h-8 rounded-lg border border-bg2 bg-bg1 px-3 text-lg"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    class="text-sm text-re"
                  />
                </label>
                <button
                  type="submit"
                  id="login"
                  class="mt-2 mb-3 w-32 self-center rounded-2xl bg-bgb p-3 hover:bg-bg2"
                  disabled={isSubmitting}
                >
                  Log in
                </button>
              </Form>
            );
          }}
        </Formik>
        <a href="/sign-up" class="self-center pt-1 hover:text-bg2">
          <h1 class="font-body">Sign up for MovieHand</h1>
        </a>
      </div>
    </div>
  );
};

export default LogIn;

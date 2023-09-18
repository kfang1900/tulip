"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useField,
  FieldHookConfig,
} from "formik";
import * as Yup from "yup";

interface LoginError {
  email?: string;
  password?: string;
}

interface MyTextInputProps {
  label: string;
  id?: string;
  name: string;
}
const registerModal = () => {
  return (
    <>
      <div tw="text-[16px] leading-7 text-grey-8B font-semibold">Welcome!</div>
      <div tw="font-bold text-[20px] leading-7 text-[#333333]">
        Join the community
      </div>
      <Formik
        initialValues={{ email: "", displayName: "", password: "" }}
        validateOnChange={false}
        validate={(values) => {
          const errors: LoginErrors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.displayName) {
            errors.displayName = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const credential = await auth.createUserWithEmailAndPassword(
              values.displayName,
              values.email,
              values.password,
            );
            if (credential && credential.user) {
              console.log("creating user with uid ", credential.user.uid);
              //Create a database reference for this user to later store user information.
              const ref = await createUserWithID(
                credential.user.uid,
                values.displayName,
                values.email,
              );
              console.log("created user with uid ", ref);
              if (props.redirect) props.redirect();
              props.onClose();
            }
          } catch (error: any) {
            switch (error.code) {
              case "auth/email-already-in-use": {
                setFieldError(
                  "email",
                  "An account with that email already exists",
                );
                break;
              }
              case "auth/invalid-email": {
                setFieldError("email", "Invalid email address");
                break;
              }
              case "auth/weak-password": {
                setFieldError("password", "Password is not strong enough");
                break;
              }
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form tw="mt-3">
            <div>
              <div css={[styles.label, styles.req]}>Email address</div>
              <Field type="email" name="email" css={styles.input} />
              <div css={styles.error}>
                <ErrorMessage name="email" />
              </div>
            </div>
            <div>
              <div css={[styles.label, styles.req]}>Name</div>
              <Field type="text" name="displayName" css={styles.input} />
              <div css={styles.error}>
                <ErrorMessage name="displayName" />
              </div>
            </div>
            <div css={[styles.label, styles.req]}>Password</div>
            <div tw="relative">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                css={styles.input}
              />
              <button
                tw="bg-transparent border-none outline-none text-[#333333] underline text-[13px] leading-[18px] cursor-pointer absolute top-[18px] right-[10px]"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <div css={styles.error}>
                <ErrorMessage name="password" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              css={[
                buttons.red,
                tw`bg-[#333333] hover:bg-[#3f3f3f] text-[16px] font-normal mt-5 w-full duration-150 h-14`,
              ]}
            >
              Create Account
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: string;
}
const InputField = ({ label, ...props }: InputFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label>
        {label}
        <input {...field} {...props} />
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const RegisterForm = () => {
  return (
    <>
      <h1>Join Tulip</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          lastName: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email addresss`")
            .required("Required"),
          password: Yup.string()
            .required("Required")
            .min(8, "Password is too short - should be 8 chars minimum.")
            .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await new Promise((r) => setTimeout(r, 500));
          setSubmitting(false);
        }}
      >
        <Form>
          <InputField label="First Name" type="text" name="firstName" />
          <InputField label="Last Name" type="text" name="lastName" />
          <InputField label="Email" type="email" name="email" />
          <InputField label="Password" type="password" name="password" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
};

function App() {
  return <RegisterForm />;
}

export default App;

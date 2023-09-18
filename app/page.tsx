"use client";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={() => signIn("google")}>Sign in with Provider</button>
    </div>
  );
};

export default SignIn;

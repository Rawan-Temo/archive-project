import React from "react";
import "./Login.css"
const LoginForm = () => {
  return (
    <div>
      <form className="login-form">
        <p className="login-text">
          <span className="fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x"></i>
            <i className="fa fa-lock fa-stack-1x"></i>
          </span>
        </p>
        <input
          type="email"
          className="login-username"
          autoFocus={true}
          required
          placeholder="Email"
        />
        <input
          type="password"
          className="login-password"
          required
          placeholder="Password"
        />
        <input
          type="submit"
          name="Login"
          value="Login"
          className="login-submit"
        />
      </form>
      <a href="#" className="login-forgot-pass">
        Forgot password?
      </a>
      <div className="underlay-photo"></div>
      <div className="underlay-black"></div>
    </div>
  );
};

export default LoginForm;

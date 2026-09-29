import AuthForm from "../components/AuthForm";

function LoginPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-caption">
          <hr className="primary" />
          <p> Access Your Account </p>
          <hr className="primary" />
        </div>
        <div className="page-header-hero">
          <h1> Login </h1>
        </div>
      </div>
      <AuthForm />
    </div>
  );
}

export default LoginPage;

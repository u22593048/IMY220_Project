import LoginForm from "../components/Auth/LoginForm";

export default function Login(){
  return (
    <main className="container page">
      <section className="card card-pad grid">
        <h1 className="m0">Login</h1>
        <p className="help">Welcome back. Enter your details below.</p>
        <LoginForm />
      </section>
    </main>
  );
}

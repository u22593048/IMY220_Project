import SignUpForm from "../components/Auth/SignUpForm";

export default function Signup(){
  return (
    <main className="container page">
      <section className="card card-pad grid">
        <h1 className="m0">Sign Up</h1>
        <p className="help">Create your account below.</p>
        <SignUpForm />
      </section>
    </main>
  );
}

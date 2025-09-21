export default function Home() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Hello World!</h1>
      <nav style={{ marginTop: 20 }}>
        <a href="/register" style={{ marginRight: 10 }}>Register</a>
        <a href="/login">Login</a>
      </nav>
    </div>
  );
}
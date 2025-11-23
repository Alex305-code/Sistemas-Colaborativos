import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function App() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isLogin = mode === "login";

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setErrorMsg("");
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        alert(`Bienvenido, ${res.user.displayName || res.user.email}`);
        // aquí luego rediriges al chat
      } else {
        if (password !== confirm) {
          setErrorMsg("Las contraseñas no coinciden.");
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (fullName.trim()) {
          await updateProfile(cred.user, { displayName: fullName.trim() });
        }

        alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
        handleModeChange("login");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      alert(
        `Sesión iniciada como ${
          result.user.displayName || result.user.email
        }`
      );
      // aquí luego rediriges al chat
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      {/* Panel izquierdo */}
      <section className="info-panel">
        <div className="badge">
          <span>⚡</span>
          <span>Chat colaborativo en tiempo real · Siscolab</span>
        </div>

        <h1 className="info-title">
          Sistema de Chat <span>Colaborativo</span>
        </h1>

        <p className="info-text">
          Plataforma interna para que los empleados de la empresa puedan
          comunicarse en tiempo real. Autenticación delegada a Firebase,
          comunicación de chat mediante WebSockets y experiencia tipo aplicación
          de escritorio.
        </p>

        <div className="features">
          <article className="feature-card">
            <div className="feature-icon chat">💬</div>
            <div>
              <h3 className="feature-title">Mensajería instantánea</h3>
              <p className="feature-text">
                Envío y recepción de mensajes casi al instante, sin recargas y
                sin polling.
              </p>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-icon team">👥</div>
            <div>
              <h3 className="feature-title">Colaboración en equipo</h3>
              <p className="feature-text">
                Múltiples usuarios conectados al mismo tiempo en un entorno
                seguro y controlado.
              </p>
            </div>
          </article>
        </div>

        <p className="info-footer">
          Proyecto académico de Sistemas Colaborativos. El módulo de login se
          integra con el chat en tiempo real desarrollado por el backend del
          equipo.
        </p>
      </section>

      {/* Tarjeta de autenticación */}
      <section className="auth-card">
        <div className="logo-wrap">
          <div className="logo-badge">💬</div>
        </div>

        <h2 className="auth-title">
          {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
        </h2>
        <p className="auth-subtitle">
          Autentícate para acceder al chat colaborativo en tiempo real.
        </p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => handleModeChange("login")}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => handleModeChange("register")}
          >
            Registrarse
          </button>
        </div>

        {/* Error */}
        {errorMsg && <div className="error-box">{errorMsg}</div>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div>
              <label className="field-label">Nombre completo</label>
              <input
                type="text"
                className="field-input"
                placeholder="Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="field-label">Correo electrónico</label>
            <input
              type="email"
              className="field-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="field-label">Confirmar contraseña</label>
              <input
                type="password"
                className="field-input"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : isLogin
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line" />
          <span>o continúa con</span>
          <div className="divider-line" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <span className="google-icon">G</span>
          <span>Google</span>
        </button>

        <p className="auth-footer">
          Autenticación gestionada por Firebase.  
          Al continuar aceptas el uso académico de tu información básica de
          perfil.
        </p>
      </section>
    </main>
  );
}

export default App;

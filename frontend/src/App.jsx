// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const API_BASE = "http://localhost:4000"; // backend

async function syncUserWithBackend(firebaseUser) {
  if (!firebaseUser) return;

  try {
    const reqBody = {
      firebaseUid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      provider:
        (firebaseUser.providerData &&
          firebaseUser.providerData[0] &&
          firebaseUser.providerData[0].providerId) ||
        "password",
    };

    console.log("📤 Enviando datos al backend:", reqBody); // Para depurar

    const res = await fetch(`${API_BASE}/api/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (res.ok) {
      console.log("✅ Usuario sincronizado con MongoDB");
    } else {
      const errorData = await res.text();
      console.error("❌ Error del Backend:", res.status, errorData);
    }
  } catch (err) {
    console.error("❌ No se pudo conectar con el servidor:", err);
  }
}

function App() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState(null); // usuario autenticado
  const [checkingAuth, setCheckingAuth] = useState(true); // mientras Firebase responde

  const isLogin = mode === "login";

  // Escuchar sesión de Firebase (login / logout / refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

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
        // INICIAR SESIÓN CON CORREO
        const res = await signInWithEmailAndPassword(auth, email, password);
        await syncUserWithBackend(res.user); // ⬅️ GUARDAR EN MONGO
        alert(`Bienvenido, ${res.user.displayName || res.user.email}`);
      } else {
        // REGISTRO
        if (password !== confirm) {
          setErrorMsg("Las contraseñas no coinciden.");
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);

        if (fullName.trim()) {
          await updateProfile(cred.user, { displayName: fullName.trim() });
          await cred.user.reload();
        }

        // guardar en Mongo
        await syncUserWithBackend(cred.user);

        alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
        handleModeChange("login");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message || "Ocurrió un error al procesar tu solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGIN CON GOOGLE
  const call_login_google = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      console.log("Usuario Google:", user);

      await syncUserWithBackend(user); // ⬅️ GUARDAR EN MONGO

      alert(`Sesión iniciada como ${user.displayName || user.email}`);
    } catch (error) {
      console.error("Error Google Login:", error);
      setErrorMsg("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Mientras se verifica si hay sesión
  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Cargando sesión...</p>
      </div>
    );
  }

  // Si hay usuario logueado → Chat
  if (user) {
    return <ChatLayout user={user} onLogout={handleLogout} />;
  }

  // Si NO hay usuario → Login / Registro
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

          <button type="submit" className="primary-btn" disabled={loading}>
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
          onClick={call_login_google}
          disabled={loading}
        >
          <span className="google-icon">G</span>
          <span>Google</span>
        </button>

        <p className="auth-footer">
          Autenticación gestionada por Firebase. <br />
          Al continuar aceptas el uso académico de tu información básica de
          perfil.
        </p>
      </section>
    </main>
  );
}

/* =======================
   Layout del Chat con WebSocket
   ======================= */

function ChatLayout({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  const displayName = user.displayName || user.email || "Usuario";

  // Conectar WebSocket al montar el componente
  useEffect(() => {
    const username = encodeURIComponent(displayName);
    const email = encodeURIComponent(user.email || "");

    const socket = new WebSocket(
      `ws://localhost:4000/ws?username=${username}&email=${email}`
    );

    socketRef.current = socket;

    socket.addEventListener("open", () => {
      console.log("🔗 WebSocket conectado");
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            ...data,
          },
        ]);
      } catch (err) {
        console.error("Error al parsear mensaje del servidor:", err);
      }
    });

    socket.addEventListener("close", () => {
      console.log("🔌 WebSocket cerrado");
    });

    socket.addEventListener("error", (err) => {
      console.error("❌ Error WebSocket:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [displayName, user.email]);

  // Enviar mensaje al servidor
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("La conexión con el servidor no está disponible.");
      return;
    }

    const msg = {
      type: "chat_message",
      text,
    };

    socketRef.current.send(JSON.stringify(msg));
    setInput("");
  };

  const formatTime = (ts) => {
    const d = new Date(ts || Date.now());
    return d.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-shell">
      <aside className="chat-sidebar">
        <div className="chat-logo">💬 Siscolab</div>
        <div className="chat-user">
          <div className="avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" />
            ) : (
              displayName[0].toUpperCase()
            )}
          </div>
          <div className="user-info">
            <strong>{displayName}</strong>
            <span>{user.email}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <h2># general</h2>
          <p>Canal principal del chat colaborativo</p>
        </header>

        <section className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              {/* Mensajes del sistema */}
              {(msg.type === "user_joined" || msg.type === "user_left") && (
                <div className="msg-text" style={{ fontSize: 12, opacity: 0.8 }}>
                  {msg.message ||
                    (msg.type === "user_joined"
                      ? `${msg.username} se ha conectado`
                      : `${msg.username} se ha desconectado`)}
                </div>
              )}

              {/* Mensajes normales */}
              {msg.type === "new_message" && (
                <>
                  <div className="msg-author">{msg.username}</div>
                  <div className="msg-text">{msg.text}</div>
                  <div className="msg-time">{formatTime(msg.createdAt)}</div>
                </>
              )}
            </div>
          ))}
        </section>

        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </main>
    </div>
  );
}

export default App;

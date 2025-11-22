import { useState } from "react";

function App() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, tab });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-stretch gap-8">
        {/* IZQUIERDA */}
        <section className="flex-1 bg-gradient-to-b from-[#f5f7ff] to-white rounded-[32px] shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-6 md:px-12 py-10 md:py-16">
          {/* Chip */}
          <div className="inline-flex items-center text-xs font-medium text-blue-600 bg-[#e5efff] px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="mr-2 text-sm">⚡</span>
            <span>Chat en Tiempo Real</span>
          </div>

          {/* Títulos */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-4">
            Sistema de Chat{" "}
            <span className="text-[#2563ff]">Colaborativo</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl mb-10">
            Comunícate y colabora con tu equipo en tiempo real. Mensajería
            instantánea con WebSockets para una experiencia fluida.
          </p>

          {/* Tarjetas inferiores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <article className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl border border-[#2563ff33] flex items-center justify-center">
                <span className="text-[#2563ff] text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">
                  Mensajería Instantánea
                </h3>
                <p className="text-xs text-slate-500">
                  Envía y recibe mensajes al instante.
                </p>
              </div>
            </article>

            <article className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl border border-[#7c3aed33] flex items-center justify-center">
                <span className="text-[#7c3aed] text-xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">
                  Múltiples Usuarios
                </h3>
                <p className="text-xs text-slate-500">
                  Chatea con todo tu equipo en un solo lugar.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* DERECHA */}
        <section className="w-full md:w-[380px]">
          <div className="bg-white rounded-[32px] shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-slate-100 px-6 md:px-8 py-8 md:py-10 flex flex-col">
            {/* Icono */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563ff] to-[#7c3aed] flex items-center justify-center shadow-[0_18px_40px_rgba(37,99,255,0.4)]">
                <div className="w-7 h-7 rounded-lg border-2 border-white flex items-center justify-center text-white text-xl font-semibold">
                  💬
                </div>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-xl md:text-2xl font-semibold text-center text-slate-900 mb-1">
              Bienvenido
            </h2>
            <p className="text-center text-xs md:text-sm text-slate-500 mb-7">
              Inicia sesión o crea una cuenta para comenzar
            </p>

            {/* Tabs */}
            <div className="flex mb-6 bg-[#edf0f5] rounded-full p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 py-2 rounded-full transition ${
                  tab === "login"
                    ? "bg-white shadow-sm text-slate-500"
                    : "text-slate-500"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`flex-1 py-2 rounded-full transition ${
                  tab === "register"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500"
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-[11px] font-medium text-slate-50 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ✉
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent text-sm placeholder:text-slate-400"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    🔒
                  </span>
                  <input
                    type="password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent text-sm placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#020617] text-white font-medium text-sm mt-2 hover:bg-black transition shadow-[0_14px_35px_rgba(15,23,42,0.4)]"
              >
                {tab === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
              <div className="flex-1 h-px bg-slate-200" />
              <span>O CONTINÚA CON</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 bg-white text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition"
            >
              <span className="text-lg">G</span>
              <span>Google</span>
            </button>

            <p className="mt-5 text-[10px] text-center text-slate-400 leading-relaxed">
              Al continuar, aceptas los términos de servicio
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

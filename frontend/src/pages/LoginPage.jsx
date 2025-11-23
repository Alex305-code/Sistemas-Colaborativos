import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        alert("Inicio de sesión con Google exitoso");
    } catch (error) {
        console.error(error);
        alert("Error iniciando sesión con Google");
    }
};

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { createUserDocument } from "./firestore";

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(result.user.uid, email);
  return result.user;
}

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocument(result.user.uid, result.user.email ?? "");
  return result.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function updateUserEmail(newEmail: string): Promise<void> {
  if (!auth.currentUser) throw new Error("Not authenticated");
  await updateEmail(auth.currentUser, newEmail);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

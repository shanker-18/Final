// src/firebaseChat.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Chat Firebase Config
const firebaseChatConfig = {
  apiKey: "AIzaSyD9100Cpb_y8DYrR6XmIRLYKCrLsxfXw44",
  authDomain: "freelancehub-chat.firebaseapp.com",
  projectId: "freelancehub-chat",
  storageBucket: "freelancehub-chat.firebasestorage.app",
  messagingSenderId: "497406153256",
  appId: "1:497406153256:web:8ca3492edab5612137db1d"
};

// Initialize a separate Firebase app ONLY for Chat
const chatApp = initializeApp(firebaseChatConfig, "chat-app");

// Export Firestore & Storage from this Chat App
export const chatDb = getFirestore(chatApp);
export const chatStorage = getStorage(chatApp);

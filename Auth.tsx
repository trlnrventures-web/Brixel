import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Login link sent to your email!");
  };

  return (
    <div>
      <h2>Login</h2>
      <input 
        type="email" 
        placeholder="Enter email" 
        onChange={(e) => setEmail(e.target.value)} 
      />

      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}

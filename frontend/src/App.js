import { useState } from 'react'
import { PageRouter } from "./components";
import "./App.css";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const [authToken, setAuthToken] = useState("token" in localStorage ? localStorage["token"] : "")

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      <PageRouter />
    </AuthContext.Provider>
  )
}

export default App;

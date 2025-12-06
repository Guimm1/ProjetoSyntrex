import "./App.css";
// Importando o outlet, do REA
import { Outlet } from "react-router-dom";


function App() {
  return (
    <div className="App d-flex">
        <Outlet />
    </div>
  );
}

export default App;
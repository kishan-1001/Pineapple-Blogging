import { Routes,Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
const App = () => {
    return (
       <Routes>
           <Route path="/" element={<Navbar />} />
           <Route path="sign in" element={ <h1>sign in page</h1>} />
           <Route path="sign up" element={ <h1>sign up page</h1>} />
       </Routes>
    )
}

export default App;
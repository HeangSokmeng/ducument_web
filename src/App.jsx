
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import UserPage from "./pages/User/UserPage";
import AuthorPage from "./pages/author/AuthorPage";

function App() {
  return (
    // <div></div>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="*" element={<h1>404 Not Found!</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

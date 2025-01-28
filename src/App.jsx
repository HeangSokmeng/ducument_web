import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import MainLayoutAuth from "./components/layouts/MainLayoutAuth";
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute
import LoginPage from "./pages/Auth/LoginPage";
import AuthorPage from "./pages/author/AuthorPage";
import CategoryPage from "./pages/Category/CategoryPage";
import DocumentPage from "./pages/Document/DocumentPage";
import HomePage from "./pages/Home/HomePage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import UnauthorizedPage from "./pages/NotFound/UnauthorizedPage";
import RolePage from "./pages/Role/RolePage";
import UserPage from "./pages/User/UserPage";
import DocumentDisplay from "./pages/views/doc";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          {/* <Route path="/home" element={<HomePage />} /> */}
          {/* Protected routes wrapped with ProtectedRoute */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author"
            element={
              <ProtectedRoute>
                <AuthorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role"
            element={
              <ProtectedRoute>
                <RolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentation"
            element={
              <ProtectedRoute>
                <DocumentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route element={<MainLayoutAuth />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/documentDisplay" element={<DocumentDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./LandingPage";
import AdminLayout from "./admin/layout";
import AdminDashboard from "./admin/page";
import AdminLogin from "./admin/login/page";
import SettingsPage from "./admin/settings/page";
import AdminProjects from "./admin/projects/page";
import AdminTestimonials from "./admin/testimonials/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found.jsx";
import Home from "./pages/Home.jsx";
import HomePage from "./pages/HomePage.jsx";
import { PostProvider } from "./context/PostContext";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup.jsx";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Aipost" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PostProvider>
          <Toaster />
          <AppRouter />
        </PostProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

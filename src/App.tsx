import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const EventRegister = lazy(() => import("./pages/EventRegister"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const ScheduleCreate = lazy(() => import("./pages/ScheduleCreate"));
const VenueMap = lazy(() => import("./pages/VenueMap"));
const MyPage = lazy(() => import("./pages/MyPage"));
const PastEvents = lazy(() => import("./pages/PastEvents"));
const PastEventDetail = lazy(() => import("./pages/PastEventDetail"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const AuthError = lazy(() => import("./pages/AuthError"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ReturnPlanner = lazy(() => import("./pages/ReturnPlanner"));

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/event/register" element={<EventRegister />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/schedule/create" element={<ScheduleCreate />} />
      <Route path="/venue-map" element={<VenueMap />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/past-events" element={<PastEvents />} />
      <Route path="/mypage/past-events/:id" element={<PastEventDetail />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/error" element={<AuthError />} />
      <Route path="/profile/setup" element={<ProfileSetup />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/return-planner" element={<ReturnPlanner />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
export { AppRoutes };

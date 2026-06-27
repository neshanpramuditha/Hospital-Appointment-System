import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <GoogleOAuthProvider clientId="734459955505-r1kfap3klvv4hcm0gf8mpp93amug9tsd.apps.googleusercontent.com">
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;
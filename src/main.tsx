import { createRoot } from "react-dom/client";
import "./kit/styles/global.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/route.tsx";
import { ThemeProvider } from "./helpers/ThemeProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
);

import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/layout";

import { Detail } from "./pages/detail/detail";
import { Home } from "./pages/home/home";
import { Notfound } from "./pages/notfound/notfound";

/*createBrowserRouter: cria navegações*/
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        /*rota dinamica*/
        path: "detail/:cripto",
        element: <Detail />,
      },
      {
        /*rota de não encontrado*/
        path: "*",
        element: <Notfound />,
      },
    ],
  },
]);

export { router };

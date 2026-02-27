import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home";
import Add from "./pages/Add";
import Header from './components/Header';
import Footer from './components/Footer';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/add",
    element: <Add />
  }
]);

function App() {
  return (
    <>
    <Header/>
    <RouterProvider router={router} />
    <Footer/>
    </>
    
  );
}

export default App
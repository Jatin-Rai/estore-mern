import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <Header />
      <main className="px-2 sm:px-16 py-8">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App

import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Project from "./components/Project";
import Header from "./components/Header";
import TransferRek from "./components/TransferRek";
import TransferVA from "./components/TransferVA";
import MutasiRek from "./components/MutasiRek";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Header> </Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="TransferRek" element={<TransferRek />} />
          <Route path="TransferVA" element={<TransferVA />} />
          <Route path="MutasiRek" element={<MutasiRek />} />
          <Route path="project" element={<Project />} />
        </Routes>
      </ChakraProvider>
    </div>
  );
}
export default App;

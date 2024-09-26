import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import './index.css';
import Location from "./pages/Location";
import Fees from "./pages/Fees";
import Survivors from "./pages/Survivors";
import Contact from "./pages/Contact";
import Grievance from "./pages/Grievance";
import Attendance from "./pages/Attendance";
import Registration from "./pages/Registration";
import Portal from "./pages/portal";
import Videos from "./pages/videos";

function App() {
  return (
    <BrowserRouter>   
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />   
          <Route path="/location" element={<Location />} />    
          <Route path="/fees" element={<Fees />} />    
          <Route path="/survivors" element={<Survivors />} />     
          <Route path="/contact" element={<Contact />} />  
          <Route path="/grievance" element={<Grievance />} />     
          <Route path="/attendance" element={<Attendance />} />     
          <Route path="/registration" element={<Registration />} />    
          <Route path="/portal" element={<Portal />} />     
          <Route path="/videos" element={<Videos />} />
        </Route>
    </Routes>  
    </BrowserRouter>
  );
}

export default App;

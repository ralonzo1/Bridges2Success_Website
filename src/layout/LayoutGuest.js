import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function LayoutGuest() {
    return (
    <div className="bg-gray-100 container  m-auto">
            <Outlet/>
    </div>
    );
}
import React from "react";
import "@radix-ui/themes/styles.css";
import "./styles.css";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./src/pages/Home";

const App: React.FC = () => {
	return (
		<Theme appearance="inherit" radius="none" scaling="100%">
			<Router>
				<main className="min-h-screen font-serif">
					<Routes>
						<Route path="/" element={<Home />} />
					</Routes>
					<ToastContainer
						position="top-right"
						autoClose={3000}
						newestOnTop
						closeOnClick
						pauseOnHover
					/>
				</main>
			</Router>
		</Theme>
	);
};

export default App;

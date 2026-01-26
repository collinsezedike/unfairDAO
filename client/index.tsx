import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import SolanaProvider from "./src/context/SolanaProvider.tsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<SolanaProvider>
			<App />
		</SolanaProvider>
	</React.StrictMode>,
);

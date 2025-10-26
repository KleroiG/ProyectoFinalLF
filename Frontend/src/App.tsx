import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from './routes';
import NotFound from "./pages/NotFound.tsx";
import Layout from "./components/layout/Layout.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    {routes.map(r => (
                        <Route key={r.path} path={r.path} element={r.element}/>
                    ))}
                </Route>

                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App

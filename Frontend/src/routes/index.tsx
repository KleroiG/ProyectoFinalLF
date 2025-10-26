import React from 'react';
import type {IconType} from 'react-icons';
import { FiHome, FiPlusCircle, FiShield, FiEye, FiList, FiCode, FiLayers } from 'react-icons/fi';

import Decode from '../pages/Decode';
import Generate from '../pages/Generate';
import Home from "../pages/Home";
import LexicalAnalysis from "../pages/LexicalAnalysis";
import SyntacticAnalysis from "../pages/SyntacticAnalysis";
import SemanticAnalysis from "../pages/SemanticAnalysis";
import VerifySignature from "../pages/VerifySignature";

interface Route {
    path: string;
    name: string;
    element: React.ReactNode;
    icon: IconType;
}

export const routes: Route[] = [
    {
        path: '/',
        name: 'Inicio',
        element: <Home/>,
        icon: FiHome
    },
    {
        path: '/generate',
        name: 'Generar',
        element: <Generate/>,
        icon: FiPlusCircle,
    },
    {
        path: '/verify-signature',
        name: 'Verificar firma',
        element: <VerifySignature/>,
        icon: FiShield,
    },
    {
        path: '/decode',
        name: 'Decodificar',
        element: <Decode/>,
        icon: FiEye,
    },
    {
        path: '/lexical-analysis',
        name: 'Análisis léxico',
        element: <LexicalAnalysis/>,
        icon: FiList,
    },
    {
        path: '/syntactic-analysis',
        name: 'Análisis sintáctico',
        element: <SyntacticAnalysis/>,
        icon: FiCode,
    },
    {
        path: '/semantic-analysis',
        name: 'Análisis semántico',
        element: <SemanticAnalysis/>,
        icon: FiLayers,
    },
];
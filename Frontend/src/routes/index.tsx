import React from 'react';
import type {IconType} from 'react-icons';
import {FiHome, FiPlusCircle, FiShield, FiEye, FiList, FiCode, FiLayers, FiSearch, FiClock} from 'react-icons/fi';

import Decode from '../pages/Decode';
import Generate from '../pages/Generate';
import Home from "../pages/Home";
import LexicalAnalysis from "../pages/LexicalAnalysis";
import SyntacticAnalysis from "../pages/SyntacticAnalysis";
import SemanticAnalysis from "../pages/SemanticAnalysis";
import VerifySignature from "../pages/VerifySignature";
import Analyze from "../pages/Analyze.tsx";
import History from "../pages/History";

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
        path: '/decode',
        name: 'Decodificar',
        element: <Decode/>,
        icon: FiEye,
    },
    {
        path: '/verify-signature',
        name: 'Verificar Firma',
        element: <VerifySignature/>,
        icon: FiShield,
    },
    {
        path: '/analyze',
        name: 'Análisis General',
        element: <Analyze/>,
        icon: FiSearch,
    },
    {
        path: '/lexical-analysis',
        name: 'Análisis Léxico',
        element: <LexicalAnalysis/>,
        icon: FiList,
    },
    {
        path: '/syntactic-analysis',
        name: 'Análisis Sintáctico',
        element: <SyntacticAnalysis/>,
        icon: FiCode,
    },
    {
        path: '/semantic-analysis',
        name: 'Análisis Semántico',
        element: <SemanticAnalysis/>,
        icon: FiLayers,
    },
    {
        path: '/history',
        name: 'Historial',
        element: <History/>,
        icon: FiClock,
    }
];



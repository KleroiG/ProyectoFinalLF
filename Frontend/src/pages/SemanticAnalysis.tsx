import {FiLayers} from 'react-icons/fi';
import Analyze from '../components/Analyze';
import {JWTService} from '../services/jwt.service';

export default function SemanticAnalysis() {
    return (
        <Analyze
            title="Análisis Semántico"
            onAnalyze={JWTService.semanticAnalysis}
            icon={<FiLayers className="text-cyan-400 w-5 h-5"/>}
        />
    )
}

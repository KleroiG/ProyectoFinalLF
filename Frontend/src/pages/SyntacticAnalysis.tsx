import { FiCode } from 'react-icons/fi';
import Analyze from '../components/Analyze';
import { JWTService } from '../services/jwt.service';

export default function SyntacticAnalysis() {
    return (
        <Analyze
            title="Análisis Sintáctico"
            onAnalyze={JWTService.syntacticAnalysis}
            icon={<FiCode className="text-cyan-400 w-5 h-5" />}
        />
    );
}

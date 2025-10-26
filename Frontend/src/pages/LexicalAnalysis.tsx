import { FiList } from 'react-icons/fi';
import Analyze from '../components/Analyze';
import { JWTService } from '../services/jwt.service';

export default function LexicalAnalysis() {
    return (
        <Analyze
            title="Análisis Léxico"
            onAnalyze={JWTService.lexicalAnalysis}
            icon={<FiList className="text-cyan-400 w-5 h-5" />}
        />
    );
}

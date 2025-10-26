import {useState} from 'react';
import {FiLock, FiEye, FiEyeOff} from 'react-icons/fi';

interface SecretKeyInputProps {
    value: string;
    onChange: (value: string) => void;
    description: string;
}

export default function SecretKeyInput({value, onChange, description}: SecretKeyInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FiLock className="w-4 h-4 text-purple-400"/>
                Clave Secreta
            </label>
            <div className="relative">
                <input
                    type={isVisible ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Ingresa tu clave secreta"
                    className="
                        w-full px-4 py-3 pr-12
                        bg-slate-950/50 border border-white/10
                        text-gray-200 text-sm
                        placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                        transition-all duration-300
                        rounded-xl
                    "
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                    {isVisible ? (
                        <FiEyeOff className="w-5 h-5"/>
                    ) : (
                        <FiEye className="w-5 h-5"/>
                    )}
                </button>
            </div>
            <p className="text-xs text-gray-500">
              {description}
            </p>
        </div>
    );
}


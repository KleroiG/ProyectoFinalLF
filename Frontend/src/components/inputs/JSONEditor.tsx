import {useState} from 'react';
import {JSONService} from "../../services/json.service.ts";


interface JSONEditorProps {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    contentEditable?: boolean;
    rows?: number;
}

export default function JSONEditor({
   label,
   value,
   onChange,
   placeholder,
   contentEditable = true,
   rows = 8
}: JSONEditorProps) {
    const [isFocused, setIsFocused] = useState(false);
    const isValid = value.trim() === '' || JSONService.isValidJSON(value);

    const handleFormat = () => {
        if (isValid && value.trim() !== '') {
            onChange?.(JSONService.formatJSON(value));
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    {isValid && value.trim() !== '' && (
                        <button
                            type="button"
                            onClick={handleFormat}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Formatear
                        </button>
                    )}
                </div>
            </div>
            <div className={`
                relative rounded-xl transition-all duration-300 
                ${isFocused ? 'ring-3 ring-cyan-500/50 border-cyan-500/50' : 'border-white/10'}
                ${!isValid ? 'ring-3 ring-red-500/70 border-red-500/70' : ''}
            `}>
                <textarea
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    contentEditable={contentEditable}
                    rows={rows}
                    className="
                        w-full px-4 py-3
                        bg-slate-950/50
                        text-gray-200 text-sm font-mono
                        placeholder-gray-500
                        focus:outline-none
                        transition-all duration-300
                        rounded-xl
                        block
                        resize-none
                        scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                        hover:scrollbar-thumb-white/30
                    "
                />
            </div>
        </div>
    );
}


import { FiLock } from 'react-icons/fi';

interface TokenInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    rows?: number;
}

export default function TokenInput({
    value,
    onChange,
    label = "Token JWT",
    placeholder = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ...",
    rows = 6
}: TokenInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FiLock className="w-5 h-5 text-cyan-400"/>
                {label}
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="
                    w-full px-4 py-3
                    bg-slate-950/50
                    border border-white/10
                    rounded-xl
                    text-gray-200 text-sm font-mono
                    placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                    transition-all duration-300
                    resize-none
                    scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                    hover:scrollbar-thumb-white/30
                "
            />
        </div>
    );
}


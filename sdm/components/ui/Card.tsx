import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={`rounded-[28px] bg-white border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md ${className || ''}`}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
    return (
        <div className="mb-4 flex items-start justify-between">
            <div>
                <h3 className="font-semibold text-[#171717] dark:text-[#f5f5f5]">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-[#737373] dark:text-[#a3a3a3]">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export default Card;
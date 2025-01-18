// src/components/ui/alert.tsx
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertProps {
    children: React.ReactNode;
    variant?: 'default' | 'destructive';
}

export function Alert({ children, variant = 'default' }: AlertProps) {
    const variants = {
        default: {
            container: 'bg-green-50 border border-green-200',
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            text: 'text-green-700'
        },
        destructive: {
            container: 'bg-red-50 border border-red-200',
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            text: 'text-red-700'
        }
    };

    const styles = variants[variant];

    return (
        <div className={`p-4 rounded-md ${styles.container}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {styles.icon}
                </div>
                <div className={`ml-3 ${styles.text}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
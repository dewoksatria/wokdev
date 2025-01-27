import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImageModalProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}>
            <div className="relative max-w-4xl w-full h-[80vh] bg-black rounded-lg overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        </div>
    );
}
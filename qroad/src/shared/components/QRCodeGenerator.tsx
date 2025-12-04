import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeGeneratorProps {
    url: string;
    size?: number;
    className?: string;
}

export interface QRCodeGeneratorRef {
    download: (fileName?: string) => void;
}

export const QRCodeGenerator = forwardRef<QRCodeGeneratorRef, QRCodeGeneratorProps>(
    ({ url, size = 300, className = '' }, ref) => {
        const qrCodeRef = useRef<HTMLDivElement>(null);
        const qrCodeInstance = useRef<QRCodeStyling | null>(null);

        useEffect(() => {
            if (!qrCodeRef.current) return;

            // Create QR code with QRoad branding
            qrCodeInstance.current = new QRCodeStyling({
                width: size,
                height: size,
                data: url,
                margin: 10,
                qrOptions: {
                    typeNumber: 0,
                    mode: 'Byte',
                    errorCorrectionLevel: 'H', // High error correction for logo insertion
                },
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 5,
                },
                dotsOptions: {
                    type: 'rounded',
                    color: '#7c3aed', // Purple-600
                    gradient: {
                        type: 'linear',
                        rotation: 45,
                        colorStops: [
                            { offset: 0, color: '#7c3aed' }, // Purple-600
                            { offset: 1, color: '#8b5cf6' }, // Violet-500
                        ],
                    },
                },
                backgroundOptions: {
                    color: '#ffffff',
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                    color: '#6d28d9', // Purple-700
                },
                cornersDotOptions: {
                    type: 'dot',
                    color: '#5b21b6', // Purple-800
                },
            });

            // Clear previous QR code and append new one
            qrCodeRef.current.innerHTML = '';
            qrCodeInstance.current.append(qrCodeRef.current);
        }, [url, size]);

        // Expose download method via ref
        useImperativeHandle(ref, () => ({
            download: (fileName = 'qroad-qrcode') => {
                if (qrCodeInstance.current) {
                    qrCodeInstance.current.download({
                        name: fileName,
                        extension: 'png',
                    });
                }
            },
        }));

        return <div ref={qrCodeRef} className={className} />;
    }
);

QRCodeGenerator.displayName = 'QRCodeGenerator';

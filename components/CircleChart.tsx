'use client';

import { useLanguage } from '@/context/LanguageContext';

interface Segment {
    value: number;
    color: string;
    label: string;
}

interface CircleChartProps {
    segments: Segment[];
    total: number;
}

export default function CircleChart({ segments, total }: CircleChartProps) {
    const { t } = useLanguage();
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    // Calculate stroke dash offsets for each segment
    let cumulativePercent = 0;

    const segmentData = segments.map((segment) => {
        const percent = total > 0 ? (segment.value / total) * 100 : 0;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (circumference * percent) / 100;
        const rotation = (cumulativePercent / 100) * 360;
        cumulativePercent += percent;

        return {
            ...segment,
            percent,
            strokeDasharray,
            strokeDashoffset,
            rotation,
        };
    });

    return (
        <div className="rounded-2xl border p-3" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <h3 className="font-medium mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>{t('totalSummary')}</h3>

            <div className="flex items-center justify-center gap-12">
                {/* Circle Chart */}
                <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                        />
                        {/* Segment Circles */}
                        {segmentData.map((segment, index) => (
                            <circle
                                key={index}
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="12"
                                strokeLinecap="butt"
                                strokeDasharray={`${(segment.percent / 100) * circumference} ${circumference}`}
                                transform={`rotate(${segment.rotation - 90} 50 50)`}
                                className="transition-all duration-500"
                            />
                        ))}
                    </svg>
                    {/* Center Value */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {total}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 w-48">
                    {segmentData.map((segment, index) => (
                        <div key={index} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                    {segment.label}
                                </span>
                            </div>
                            <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                                {segment.value} ({segment.percent.toFixed(0)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-xs mt-1 text-center opacity-75" style={{ color: 'var(--text-muted)' }}>
                {t('proportion')}
            </p>
        </div>
    );
}

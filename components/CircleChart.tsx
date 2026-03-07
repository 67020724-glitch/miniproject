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
        <div className="rounded-3xl border p-6 md:p-10 shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <h3 className="font-black mb-10 text-xl md:text-2xl" style={{ color: 'var(--text-primary)' }}>{t('totalSummary')}</h3>

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
                            className="stroke-gray-200 dark:stroke-slate-700"
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
                        <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                            {total}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-4 w-56">
                    {segmentData.map((segment, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="text-sm md:text-base font-bold truncate" style={{ color: 'var(--text-secondary)' }}>
                                    {segment.label}
                                </span>
                            </div>
                            <span className="text-sm font-black shrink-0" style={{ color: 'var(--text-primary)' }}>
                                {segment.value} <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>({segment.percent.toFixed(0)}%)</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-[10px] mt-8 text-center font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t('proportion')}
            </p>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    scrollable?: boolean;
}

export default function News({ items, title, scrollable = false }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            {scrollable ? (
                <ul className="max-h-[200px] list-disc space-y-2 overflow-y-scroll overscroll-contain pl-5 pr-3 text-sm text-neutral-700">
                    {items.map((item, index) => (
                        <li key={index} className="leading-relaxed">
                            <strong className="font-semibold text-neutral-700">{item.date}</strong>
                            <span>:&nbsp;{item.content}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <span className="mt-1 w-16 flex-shrink-0 text-xs text-neutral-500">{item.date}</span>
                            <p className="text-sm text-neutral-700">{item.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </motion.section>
    );
}

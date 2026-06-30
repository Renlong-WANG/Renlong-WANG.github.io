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
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;
    const isNewsSection = resolvedTitle.trim().toLowerCase() === 'news' || resolvedTitle.includes('新闻');

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            {isNewsSection ? (
                <div className="max-h-[280px] overflow-y-auto overscroll-contain pr-2">
                    <div className="space-y-3 border-l border-neutral-200 dark:border-neutral-800 pl-4">
                        {items.map((item, index) => (
                            <div key={index} className="relative grid grid-cols-[4.75rem_1fr] gap-3 text-sm leading-relaxed">
                                <span className="absolute -left-[1.1875rem] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-background" />
                                <time className="pt-0.5 text-xs font-semibold text-accent tabular-nums">{item.date}</time>
                                <p
                                    className="min-w-0 text-neutral-700 dark:text-neutral-500"
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 px-3 py-2.5">
                            <time className="text-xs font-semibold text-neutral-500 tabular-nums mt-0.5">{item.date}</time>
                            <p
                                className="min-w-0 text-sm text-neutral-700 dark:text-neutral-500 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </motion.section>
    );
}

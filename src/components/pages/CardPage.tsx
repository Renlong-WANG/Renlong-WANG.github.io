'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};


function formatVenueWithMetrics(item: CardPageConfig['items'][number]) {
    if (!item.subtitle) return '';

    const metrics: string[] = [];
    const journalIndex = item.index?.trim();
    const quartile = item.quartile?.trim();

    if (journalIndex && quartile) {
        metrics.push(`${journalIndex} JCR-${quartile}`);
    } else if (quartile) {
        metrics.push(`JCR-${quartile}`);
    } else if (journalIndex) {
        metrics.push(journalIndex);
    }

    const impactFactor = item.impactFactor ?? item.impact_factor;
    if (impactFactor !== undefined && impactFactor !== '') {
        metrics.push(`IF: ${impactFactor}`);
    }

    return metrics.length > 0 ? `${item.subtitle} (${metrics.join(', ')})` : item.subtitle;
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                            {item.date && (
                                <span className="ml-4 shrink-0 whitespace-nowrap text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.authors && item.authors.length > 0 && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-400 mb-2`}>
                                {item.authors.map((author, idx) => (
                                    <span key={idx}>
                                        <span className={author === 'Renlong Wang' ? 'font-semibold text-accent' : ''}>
                                            {author}
                                        </span>
                                        {idx < item.authors!.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>
                        )}
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} font-medium text-neutral-800 dark:text-neutral-600 mb-3`}>
                                {formatVenueWithMetrics(item)}
                            </p>
                        )}
                        {item.presentation && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 mb-3 leading-relaxed`}>
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">Oral presentation:</span>{' '}
                                {item.presentation}
                            </p>
                        )}
                        {item.award && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 mb-3 leading-relaxed`}>
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">Award:</span>{' '}
                                {item.award}
                            </p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                <ReactMarkdown components={markdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

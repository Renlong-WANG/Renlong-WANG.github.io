'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}


function formatVenueWithMetrics(pub: Publication) {
    const venue = pub.journal || pub.conference;
    if (!venue) return '';

    const metrics: string[] = [];
    const journalIndex = pub.index?.trim();
    const quartile = pub.quartile?.trim();

    if (journalIndex && quartile) {
        metrics.push(`${journalIndex} JCR-${quartile}`);
    } else if (quartile) {
        metrics.push(`JCR-${quartile}`);
    } else if (journalIndex) {
        metrics.push(journalIndex);
    }

    if (pub.impactFactor !== undefined && Number.isFinite(pub.impactFactor)) {
        metrics.push(`IF: ${pub.impactFactor}`);
    }

    return metrics.length > 0 ? `${venue} (${metrics.join(', ')})` : venue;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} -&gt;
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px]"
                    >
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-primary leading-tight">
                                <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                            </h3>
                            <span className="ml-4 shrink-0 whitespace-nowrap text-xs text-neutral-800 dark:text-neutral-200 font-semibold bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                                {pub.year}
                            </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        {(pub.journal || pub.conference) && (
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-600 mb-2">
                                {formatVenueWithMetrics(pub)}
                            </p>
                        )}
                        {pub.presentation && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-1 leading-relaxed">
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">Oral presentation:</span>{' '}
                                {pub.presentation}
                            </p>
                        )}
                        {pub.award && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-1 leading-relaxed">
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">Award:</span>{' '}
                                {pub.award}
                            </p>
                        )}
                        {pub.description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                {pub.description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

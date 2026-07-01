'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Publication } from '@/types/publication';
import { CardItem, CardPageConfig, ResearchPageConfig } from '@/types/page';
import { getDraftAnchor, getPublicationAnchor } from '@/lib/slugs';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface ResearchPageProps {
    config: ResearchPageConfig;
    publications: Publication[];
    draftsConfig?: CardPageConfig | null;
}

function normalizeKeyword(value: string): string {
    return value.trim().toLowerCase();
}

function matchesKeywords(values: string[] | undefined, keywords: string[]): boolean {
    if (!values || values.length === 0 || keywords.length === 0) return false;

    const valueSet = new Set(values.map(normalizeKeyword));
    return keywords.some((keyword) => valueSet.has(normalizeKeyword(keyword)));
}

function formatPublicationVenue(pub: Publication): string {
    return pub.journal || pub.conference || String(pub.year);
}

function EmptyState({ label }: { label: string }) {
    return (
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
            No matching {label} yet.
        </p>
    );
}

export default function ResearchPage({ config, publications, draftsConfig }: ResearchPageProps) {
    const publicationNumbers = new Map(publications.map((pub, index) => [pub.id, index + 1]));
    const draftItems = draftsConfig?.items || [];
    const draftNumbers = new Map(draftItems.map((draft, index) => [draft.title, index + 1]));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12"
        >
            <header className="space-y-4">
                <h1 className="text-4xl font-serif font-bold text-primary">{config.title}</h1>
                {config.description && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-500 max-w-3xl leading-relaxed">
                        {config.description}
                    </p>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                    {config.areas.map((area) => (
                        <Link
                            key={area.id}
                            href={`#${area.id}`}
                            className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 hover:text-white hover:bg-accent hover:border-accent transition-colors"
                        >
                            {area.title}
                        </Link>
                    ))}
                </div>
            </header>

            <div className="space-y-12">
                {config.areas.map((area, index) => {
                    const relatedPublications = publications.filter((pub) => matchesKeywords(pub.keywords || pub.tags, area.keywords));
                    const relatedDrafts = draftItems.filter((draft) => matchesKeywords(draft.tags, area.keywords));

                    return (
                        <motion.section
                            key={area.id}
                            id={area.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="scroll-mt-24 border-t border-neutral-200 dark:border-neutral-800 pt-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-2xl font-serif font-bold text-primary">{area.title}</h2>
                                <p className="text-base text-neutral-600 dark:text-neutral-500 leading-relaxed max-w-3xl">
                                    {area.description}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mt-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                                        Related Publications
                                    </h3>
                                    {relatedPublications.length > 0 ? (
                                        <div className="space-y-3">
                                            {relatedPublications.map((pub) => (
                                                <Link
                                                    key={pub.id}
                                                    href={`/publications#${getPublicationAnchor(pub.id)}`}
                                                    className="group flex items-start gap-3 rounded-md py-1.5 transition-colors hover:text-accent"
                                                >
                                                    <span className="mt-0.5 shrink-0 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                                                        P{publicationNumbers.get(pub.id)}
                                                    </span>
                                                    <span className="space-y-1">
                                                        <span className="block text-sm font-medium text-primary group-hover:text-accent leading-snug">
                                                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                                        </span>
                                                        <span className="block text-xs text-neutral-500">
                                                            {formatPublicationVenue(pub)} - {pub.year}
                                                        </span>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState label="publications" />
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                                        Related Drafts
                                    </h3>
                                    {relatedDrafts.length > 0 ? (
                                        <div className="space-y-3">
                                            {relatedDrafts.map((draft: CardItem) => (
                                                <Link
                                                    key={draft.title}
                                                    href={`/publications#${getDraftAnchor(draft.title)}`}
                                                    className="group flex items-start gap-3 rounded-md py-1.5 transition-colors hover:text-accent"
                                                >
                                                    <span className="mt-0.5 shrink-0 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                                                        D{draftNumbers.get(draft.title)}
                                                    </span>
                                                    <span className="space-y-1">
                                                        <span className="block text-sm font-medium text-primary group-hover:text-accent leading-snug">
                                                            {draft.title}
                                                        </span>
                                                        {(draft.subtitle || draft.date) && (
                                                            <span className="block text-xs text-neutral-500">
                                                                {[draft.subtitle, draft.date].filter(Boolean).join(' - ')}
                                                            </span>
                                                        )}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState label="drafts" />
                                    )}
                                </div>
                            </div>
                        </motion.section>
                    );
                })}
            </div>
        </motion.div>
    );
}

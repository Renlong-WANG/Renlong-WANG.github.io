export function slugifyText(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'item';
}

export function getPublicationAnchor(id: string): string {
  return `publication-${slugifyText(id)}`;
}

export function getDraftAnchor(title: string): string {
  return `draft-${slugifyText(title)}`;
}

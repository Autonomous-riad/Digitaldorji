export type GarmentSlug =
  | 'formal-shirt'
  | 'panjabi'
  | 'formal-trouser'
  | 'pajama'
  | 'three-piece'
  | 'saree-blouse'
  | 'kurti'
  | 'burkha';

export function getGarmentSlug(idOrSlugOrName: string): GarmentSlug {
  const str = (idOrSlugOrName || '').toLowerCase();
  
  if (str.includes('burkha') || str.includes('abaya') || str.includes('hijab')) {
    return 'burkha';
  }
  if (str.includes('blouse') || str.includes('saree')) {
    return 'saree-blouse';
  }
  if (str.includes('three-piece') || str.includes('salwar') || str.includes('kameez-set')) {
    return 'three-piece';
  }
  if (str.includes('kurti') || str.includes('tunic') || str.includes('single-kameez')) {
    return 'kurti';
  }
  if (str.includes('pajama') || str.includes('aligarhi') || str.includes('churidar')) {
    return 'pajama';
  }
  if (str.includes('pant') || str.includes('trouser')) {
    return 'formal-trouser';
  }
  if (str.includes('panjabi') || str.includes('kurta')) {
    return 'panjabi';
  }
  if (str.includes('shirt')) {
    return 'formal-shirt';
  }

  return 'formal-shirt';
}

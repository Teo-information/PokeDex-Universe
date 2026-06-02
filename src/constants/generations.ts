export interface GenerationRange {
  id: number;
  name: string;
  label: string;
  startId: number;
  endId: number;
}

export const GENERATIONS: GenerationRange[] = [
  { id: 1, name: 'generation-i', label: 'Gen I', startId: 1, endId: 151 },
  { id: 2, name: 'generation-ii', label: 'Gen II', startId: 152, endId: 251 },
  { id: 3, name: 'generation-iii', label: 'Gen III', startId: 252, endId: 386 },
  { id: 4, name: 'generation-iv', label: 'Gen IV', startId: 387, endId: 493 },
  { id: 5, name: 'generation-v', label: 'Gen V', startId: 494, endId: 649 },
  { id: 6, name: 'generation-vi', label: 'Gen VI', startId: 650, endId: 721 },
  { id: 7, name: 'generation-vii', label: 'Gen VII', startId: 722, endId: 809 },
  { id: 8, name: 'generation-viii', label: 'Gen VIII', startId: 810, endId: 905 },
  { id: 9, name: 'generation-ix', label: 'Gen IX', startId: 906, endId: 1025 },
];

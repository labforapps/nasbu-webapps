export type TutorialComplexity = 'B' | 'I' | 'A';

export interface TutorialCategory {
  uuid: string;
  name: string;
  description: string;
  order: number;
  active: boolean;
}

export interface Tutorial {
  uuid: string;
  category: TutorialCategory;
  title: string;
  description: string;
  youtube_video_id: string;
  complexity: TutorialComplexity;
  order: number;
  duration_minutes: number;
  active: boolean;
}

import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Maps a content `image` key to an icon used by the placeholder illustration.
 * Typed against Ionicons.glyphMap, so an invalid icon name fails typecheck.
 * When real artwork is sourced, swap the Illustration component to load images
 * by this same key — the content data never changes.
 */
export const ILLUSTRATION_ICONS: Record<string, IconName> = {
  // Activities
  tummy_time: 'body-outline',
  face_gazing: 'happy-outline',
  contrast_cards: 'grid-outline',
  talk_sing: 'musical-notes-outline',
  smile_response: 'happy-outline',
  rattle_track: 'eye-outline',
  mirror_tummy: 'scan-outline',
  reach_toy: 'hand-left-outline',
  bicycle_legs: 'bicycle-outline',
  reading: 'book-outline',
  textures: 'color-filter-outline',
  roll_practice: 'sync-outline',
  peekaboo: 'eye-outline',
  sitting_play: 'body-outline',
  pass_object: 'swap-horizontal-outline',
  mirror_play: 'scan-outline',
  hide_toy: 'search-outline',
  crawl_course: 'walk-outline',
  naming_game: 'chatbubbles-outline',
  stacking: 'layers-outline',
  cruising: 'walk-outline',
  container_play: 'file-tray-outline',
  patacake: 'hand-left-outline',
  point_name: 'chatbubble-ellipses-outline',
  malish: 'water-outline',
  floor_mat_play: 'grid-outline',
  self_feeding: 'restaurant-outline',

  // Toys
  toy_contrast_book: 'book-outline',
  toy_mirror: 'scan-outline',
  toy_rattle: 'musical-note-outline',
  toy_play_gym: 'fitness-outline',
  toy_crinkle: 'color-filter-outline',
  toy_teether: 'ellipse-outline',
  toy_ball: 'baseball-outline',
  toy_stacking: 'layers-outline',
  toy_board_books: 'book-outline',
  toy_soft_blocks: 'cube-outline',
  toy_busy: 'apps-outline',
  toy_nesting: 'file-tray-stacked-outline',
  toy_push: 'car-outline',
  toy_music: 'musical-notes-outline',
  toy_household: 'restaurant-outline',
};

export const FALLBACK_ICON: IconName = 'sparkles-outline';

export function iconForImageKey(key: string): IconName {
  return ILLUSTRATION_ICONS[key] ?? FALLBACK_ICON;
}

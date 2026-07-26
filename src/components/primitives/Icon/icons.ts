/**
 * The hand-picked icon set (PRD §10.8). One geometric family, 1.5px stroke on a
 * 24×24 grid, `currentColor`. Add a glyph here only when a component needs it.
 */
export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'check'
  | 'document'
  | 'inbox'
  | 'repeat'
  | 'clock'
  | 'plug'
  | 'activity'
  | 'users'
  | 'menu'
  | 'close'

export const ICON_PATHS: Record<IconName, string> = {
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17 17 7M8 7h9v9',
  check: 'M5 13l4 4L19 7',
  document: 'M7 3h7l4 4v14H7zM14 3v4h4',
  inbox: 'M4 13h4l2 3h4l2-3h4M4 13l2-8h12l2 8v6H4z',
  repeat: 'M4 9a5 5 0 0 1 5-5h9M18 4l2 2-2 2M20 15a5 5 0 0 1-5 5H6M6 20l-2-2 2-2',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  activity: 'M3 12h4l3 8 4-16 3 8h4',
  users:
    'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M18 20a6 6 0 0 0-4-5.6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
}

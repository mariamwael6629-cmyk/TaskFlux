# TaskFlux design system: "Timetable"

A team plan is a timetable: blocks in columns, coloured by subject, written
in an exercise book. The board area is ruled like an exercise-book page with
a red margin; each card is a timetable block with a small subject-coloured
tab for its priority. The login card is the name label on a blue exercise-book
cover.

## Colour (`frontend/src/index.css` `:root`, variable names unchanged)
| Token | Value | Use |
|---|---|---|
| `--bg` / `--surface` / `--sf3` | `#F4F2EA` / `#FFFEF9` / `#ECE9DE` | page, cards, insets |
| `--text` / `--text-2` / `--text-3` | `#1B2238` / `#4A5065` / `#6C7082` | blue-black ink |
| `--accent` (+h/s/b) | `#24366B` | ink blue: primary buttons, links, active |
| `--red` | `#C0392B` | margin red: high priority, overdue, errors, active nav edge |
| `--amber` | `#A86F12` | art yellow: medium priority, under review |
| `--green` | `#2D7A4B` | science green: low priority, done |
| `--purple` | `#6A4C93` | music: documents |
| `--rule` / `--margin` | feint blue / red at low alpha | the ruled board background |

Avatar and new-workspace colours use the same subject set. Radii are 4–10px.
No glows; shadows are soft and short.

## Type
Bitter (500–700) for headings and numbers; Atkinson Hyperlegible for UI and
body. Labels are sentence case.

## Components
- `.paper`: ruled page with a red margin line (`background-attachment: local`
  so the ruling scrolls with the board).
- `.k-card`: 4px radius, top tab coloured by priority via `--k-tab`.
- Auth card: label with a double rule on the cover colour `#2F4A73`.
- Mobile (<768px): sidebar starts collapsed and overlays the page when
  opened; dashboard grids stack.

# SmartBalance — Your Work‑Life Balance Companion

SmartBalance is a privacy‑first, single‑page web app that helps you stay on top of your day: plan tasks, track spending, eat better, move more, understand your mood, preserve memories, relax with games, and download rich reports — all stored locally in your browser. No logins to external servers. No cloud required.

## Why you’ll love it
- Private by design: your data lives in your browser (per user), and you decide when to export or move it.
- All‑in‑one: productivity, finance, nutrition, fitness, mood, memories, games, and reports in one flow.
- Zero setup: open the app and start; optionally serve statically for a nicer URL.
- Friendly: clear copy, gentle nudges, and a clean UI that stays out of your way.

## Quick start
- Open index.html in a modern browser; or serve the folder (for example: npx serve -l 3000).
- Create a local account (Login overlay). Your data is scoped to this profile.
- Use the sidebar to navigate sections. Everything updates the Dashboard in real time.

## Using the app (a quick tour)
1) Create an account → you’ll see a personalized Dashboard with daily widgets and streaks.
2) Add tasks, mark expense‑related tasks if needed (auto‑adds an expense on completion).
3) Log expenses, set monthly income, budgets, and savings goals; view calendar, analytics, insights, and reports.
4) Track meals (home vs hotel), plan ahead, and analyze cost and calories.
5) Do quick home workouts and use stress‑relief tools; your mood is auto‑estimated daily.
6) Save memories, track birthdays, and browse or slideshow your photos.
7) Export any section (CSV/JSON) or download a comprehensive report.

## Features by module

### Authentication (local)
- Login, Sign Up, Forgot Password with recovery Q&A and password strength meter. Eye toggles for visibility.
- When signed out, the app hides behind the overlay; on login it restores your session state.

### Dashboard (daily pulse)
- Greeting with your name and time of day.
- Widgets: Tasks Today, Weekly Spending (₹), Workout Streak, Amount in Purse (Monthly Income − current month’s spend), Meal Suggestion, Weekly Summary.
- Today’s Activity: mini metrics for Tasks, Workouts, Meals, Spent, Balance.
- Current Streaks: Workout, Task, Mood, Savings. Amount in Purse is styled for quick readability.

### Tasks
- Filters: All, Today, Upcoming, Completed. Stats: Day Streak, Today’s Progress.
- Add Task modal: title, category, date, optional expense toggle. Completing such tasks auto‑creates an expense for that day (category inherits the task category).
- Export tasks to CSV/JSON.

### Expenses
- Tabs: Overview, Calendar, Analytics, Insights, Reports.
- Overview: Monthly Income/Spending/Savings/Rate, Savings Goal, Budget Tracker, quick charts (Category Distribution, Weekly Trend), Recent Expenses.
- Calendar: color‑coded daily spend with a detail panel.
- Analytics: Expense Distribution, Category Analysis (Pie/Bar/Doughnut), Payment Method Analysis, Weekly Pattern (Radar), auto insights.
- Insights: Financial Health Score, Income vs Expenses, Category Insights, advanced predictions, spending patterns.
- Reports: navigate Month/Quarter/Year/Week/All/Custom; summary stats; tables for categories, payment methods, monthly trends, top expenses, recent txns, budget performance. Export JSON/CSV.
- Modals: Add/Edit Expense, Budget, Savings Goal, Monthly Income, Recurring Manager.

### Food & Nutrition
- Stats: Home Meals, Hotel/Delivery, Money Saved, Calories Today.
- Daily tracking tabs (Today, Yesterday, This Week), Daily Meal Planner, and Pantry.
- Analysis: Home vs Hotel (frequency & cost), nutrition overview, Daily Calories and Meal Cost vs Delivery charts, Smart Food Insights, Meal History.
- Modals: Add Meal, Meal Selection, Regenerate Suggestions, Add Food Item, Meal Calendar.

### Fitness
- Stats: Day Streak, This Week, Total Workouts, Total Calories.
- Exercise grid (desk stretches, eye exercises, posture fix, yoga, deep breathing, wall push‑ups, calf raises, arm circles, seated twists, march in place, ankle pumps, chair squats).
- Exercise modal with timer, instructions, progress bar; completion updates streaks, calories, and badges.
- Achievement badges across fitness, food, lifestyle, finance, productivity, and tougher milestones.

### Stress & Mood
- Automated daily mood score from your activity (tasks, workouts, spending, cooking, day‑of‑week).
- Weekly Mood Chart, mood streak, current mood summary, and quick stress‑relief tools (guided breathing, meditation, stretch).

### Games
- Stats overview: Games Played, Daily Streak, Total Score, Avg Time.
- Games: 5 Queens with Colors, Sudoku, Color Pattern, 2048, Memory Cards, Snake — each with its own modal, board, controls, and timers.
- Export game stats.

### Memories
- Stats: Total Memories, This Month, Upcoming Birthdays, Storage Used.
- Tabs: Photos (gallery with filters + search) and Birthdays (upcoming + all).
- Modals: Add Memory (upload + metadata), Memory View, Slideshow (controls + progress), Add Birthday.

### Report Generator
- One‑click comprehensive report download: JSON (full) or CSV (summary).
- Summary cards: Tasks, Spending, Healthy Meals %, Workout Days, Stress Levels.
- Weekly Trends chart visualizes cross‑domain metrics side‑by‑side.

### Help
- Eight‑page in‑app guide: Dashboard, Tasks, Expenses, Food, Fitness & Wellness, Games, Memories, Reports & Export — with tips and contact.

## Data & privacy
- Storage: Browser LocalStorage, per user profile (scoped keys).
- Ownership: You fully control export/import. Clearing browser storage removes data.
- Note: Incognito/private windows may wipe data between sessions; ensure you export before clearing storage.

## Backups and restore
- Export: every section has CSV/JSON export; the Report page offers a comprehensive JSON/CSV export.
- Import: storage.js supports importing previously exported data.

## Theming & accessibility
- Light/Dark mode toggle with sensible contrast.
- Semantic markup, keyboard‑focusable controls, and unobtrusive notifications.

## Performance
- No heavy frameworks. Canvas‑based charts. Debounced updates. Work happens only for the visible section.

## Architecture (files you’ll touch most)
- index.html — layout, sections, modals, script/style includes.
- styles.css (+ section styles) — responsive layout, components, dark mode, widgets, modals.
- storage.js — LocalStorage abstraction with per‑user scoping and data helpers.
- utils.js — formatting, notifications, animations, exports, mood helpers, badges, theme & debounce.
- charts.js — Canvas charts (pie, bar, line, doughnut, radar, bubble) and drawing helpers.
- app.js — main controller: events, dashboard logic, forms, calendars, mood automation, exports.
- games.js — game engines and UI glue.
- memories.js — photos, birthdays, slideshow logic.

## Tech stack
- HTML, CSS, Vanilla JavaScript (ES6+)
- Canvas API for charts
- LocalStorage for persistence
- Static hosting (no build step required)

## Troubleshooting (common questions)
- “My data is gone”: it’s usually due to cleared browser storage or private mode. Re‑import your export or log in again and start fresh.
- “New device?”: export on the old device and import on the new one.
- “Nothing happens on click”: ensure you’re not blocking scripts; try a modern browser.

## Roadmap
- Remain 100% HTML/CSS/JS with zero external libraries or frameworks.
- Optional local encryption (Web Crypto) for exports/imports with passphrase — no servers involved.
- PWA installability and offline‑first caching (Service Worker), still served statically.
- Data engine: optional IndexedDB for larger datasets; schema versioning and safe migrations.
- Charts: richer Canvas‑based visuals (annotations, comparisons) without chart libraries.
- UX: keyboard shortcuts, improved accessibility, i18n via Intl APIs, theme customization via CSS variables.
- Import/Export: preview, diff, and selective merge for JSON/CSV backups.
- Modules: more built‑in mini‑exercises/games and wellness routines.

——
SmartBalance is built to reduce friction, not add it. Open it, take a breath, and move one step at a time — the app will keep score for you so you can focus on living well.

## Contributing
- Contributions to SmartBalance are welcome.
- Fork the repository, create a feature branch, commit changes with clear messages, push your branch, and open a Pull Request for review.
- Your contributions help improve the app and make it more user-friendly.

## Acknowledgements
- SmartBalance was inspired by the need for tools that help professionals and individuals achieve better work-life balance.
- Special thanks to early users and testers who provided valuable feedback.

## License
- This project is licensed under the MIT License.
- You are free to use, modify, and distribute it under the license terms.

## Live Demo
- Experience SmartBalance directly in your browser: [SmartBalance Live](https://kanishjebamathewm.github.io/SmartBalance/)

## Blog
- Read the full story behind SmartBalance and its development journey: [The Story of SmartBalance on Medium](https://medium.com/@kanishjebamathew.m/the-story-of-smartbalance-80e8c68424ec)

# Change Log

All notable changes to the "easy-odoo-dev" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1] 2026-01-15

- Add restart icon for better UX when restarting the Odoo server.
- Fix issue where Odoo server state were not properly updated when stopping or restarting the server.
- Increase update interval for webview state to 200ms for more responsive UI.
- Improve Status Bar items visibility management when starting/stopping/restarting Odoo server in normal and debug modes.

## [1.0.0] 2026-01-10

- Bumping version to 1.0.0 for first stable release.
- Add status bar items to start Odoo server in normal and debug modes.
- Improve buttons displayed on the main extension view.

## [0.0.2] 2026-01-06

- Add restart button in debug and normal modes.
- Add CHANGELOG.md file.
- Add no results message when no settings match the search.
- Add "Open in Browser" button to open Odoo instance in external browser.
    - Will use localhost IP if available, otherwise fallback to 127.0.0.1

## [0.0.1]

- Initial release.

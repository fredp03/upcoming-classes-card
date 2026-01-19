# Upcoming Classes Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

A custom Home Assistant Lovelace card to display and manage upcoming classes with due dates.

## Features

- Display a list of upcoming classes
- Add, edit, and delete classes
- Set due dates with a calendar picker
- Shows time remaining until due date
- Data persisted in browser localStorage

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to "Frontend" section
3. Click the three dots menu → "Custom repositories"
4. Add this repository URL with category "Dashboard"
5. Install "Upcoming Classes Card"
6. Restart Home Assistant

### Manual Installation

1. Download `upcoming-classes-card.js`
2. Copy to `/config/www/upcoming-classes-card.js`
3. Add resource in Lovelace:
   ```yaml
   resources:
     - url: /local/upcoming-classes-card.js
       type: module
   ```

## Configuration

```yaml
type: custom:upcoming-classes-card
storage_key: upcoming_classes  # Optional: localStorage key for saving data
```

## Screenshot

The card displays classes with their assignments and time remaining until due.

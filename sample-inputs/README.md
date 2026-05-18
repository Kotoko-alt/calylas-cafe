# Sample Inputs

This folder contains sample input data for the café menu and upload testing.

## Included files

- `menu-names.txt` — sample menu item names
- `menu-data.csv` — sample menu name and photo filename mapping

## How to use

1. Use `menu-names.txt` to review example menu item names.
2. Use `menu-data.csv` to prepare exact filename mappings for photo uploads.
3. Place photo files in `server/uploads/` with the same filenames used in `menu-data.csv`.
4. Use the admin panel to create or edit menu items and attach the corresponding photo.

## Sample CSV format

`menuName,photoFile`

Example:

```csv
name,photoFile
Spanish Latte,spanish-latte.png
Caramel Macchiato,caramel-macchiato.png
Matcha Latte,matcha-latte.png
Blueberry Cheesecake Slice,blueberry-cheesecake.png
Chocolate Cake,chocolate-cake.png
```

## Export example

```bash
cd server
npm run export-menu
```

This will generate `server/exports/menu-export.json` and `server/exports/photos/`.

## Notes

- If you need a DB dump, use MongoDB tools like `mongodump` or export via the admin interface.
- The frontend app will show menu images if the backend can resolve them from uploads or MongoDB photo endpoints.

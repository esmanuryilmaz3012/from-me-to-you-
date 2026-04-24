# From Me To You

A beautiful, interactive, and anonymous web-based letter writing experience. "From Me To You" allows users to craft sealed digital letters with customizable envelopes, themes, fonts, and wax seals, and share them via a unique link.

## Features
- **Dynamic Themes:** Choose between Romantic, Modern, Whimsical, and Poetic aesthetics.
- **Customizable Envelopes:** Select envelope colors, inner flap colors, and subtle patterns (dots, lines, stars, hearts, waves).
- **Interactive Stamp & Seal:** Pick your favorite stamp emoji and watch your letter get sealed with wax.
- **Anonymous Sharing:** Your sealed letter is embedded in a generated link that you can send to "someone dear". No database required.

## Tech Stack
- **HTML5:** Structure and content.
- **CSS3:** Custom properties, flexbox, grid, and CSS animations for floating elements and sparkles.
- **JavaScript (Vanilla):** DOM manipulation, Base64 encoding/decoding for stateless link sharing, theme switching.

## How to Run Locally
1. Clone the repository or download the files.
2. Open `index.html` in your favorite web browser.
3. No build tools or servers are required—it runs entirely on the client side!

## Project Structure
- `index.html` - The main entry point containing the UI structure.
- `style.css` - All styling, themes, animations, and responsive layout.
- `script.js` - Application logic for customization, word counting, sealing, and link generation.

## How it works
The application uses the browser's URL parameters to share letters statelessly. When a user creates a letter, the data is converted to JSON, URL-encoded, and converted to Base64, then appended to the URL as `?letter=...`. When a recipient opens the link, the JS decodes the parameter and reconstructs the letter.

---
*An anonymous letter, sealed with heart.*

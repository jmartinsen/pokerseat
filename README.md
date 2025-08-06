# Poker Seating Randomizer

A Vue.js application for randomizing poker seating arrangements.

## Features

- Add up to 10 players with numbered input rows
- Remove any player (including player 1) when there are two or more players
- Press Tab or Enter in name field to quickly add a new player row
- Designate any number of players as dealers using iOS-style switches (if more than 2 are marked, 2 will be randomly selected)
- Generate a randomized seating arrangement
- Horizontal rectangular poker table display with longer sides for 3 players
- Dealers placed in middle seats of long sides
- Sequential seat numbering in clockwise order with randomized starting position
- Option to edit players instead of starting over
- Clear form button with confirmation modal

## How to Use

1. Open `index.html` in a web browser
2. Enter player names in the form (each player row is numbered)
3. Press Tab or Enter after typing a name to quickly add a new player row
4. Toggle the iOS-style switch to designate players as dealers (if more than 2 are marked, 2 will be randomly selected)
5. Click "Add Player" to add more players (maximum 10)
6. Click "Remove" next to any player to remove them (available when there are two or more players)
7. Click "Clear Form" to reset the form (with confirmation)
8. Click "Generate Seating" to create the seating arrangement
9. View the seating arrangement on the rectangular poker table
10. Click "Edit Players" to go back and modify the players without starting over
11. Click "Start Over" to reset everything and start from scratch

## Table Layout

The poker table has a horizontal rectangular shape with:
- 2 seats on each short side (top and bottom)
- 3 seats on each long side (left and right), with the long sides being wider than the short sides
- Dealers are placed in the middle seats of the long sides
- Seat numbers are sequential (1-10) in clockwise order with a randomized starting position
- Non-dealer players are randomly assigned to the remaining seats
- Empty seats do not display any text

## Technical Details

This application is built with:
- Vue.js 3 (using the CDN version)
- JavaScript ES6+
- CSS3

The application is structured as follows:
- `index.html`: Main HTML file
- `src/main.js`: Entry point for the Vue application
- `src/App.js`: Main Vue component
- `src/components/PlayerForm.js`: Component for player input
- `src/components/PokerTable.js`: Component for displaying the seating arrangement
- `src/styles.css`: CSS styles for the application

## Development

To modify this application:
1. Edit the JavaScript files in the `src` directory
2. Edit the CSS in `src/styles.css`
3. Refresh the browser to see your changes

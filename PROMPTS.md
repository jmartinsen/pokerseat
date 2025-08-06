Generate a Vue.js project for randomizing poker seating. The home screen has a form with 1 row of input fields that represent the first player. And there is a button below it to add more players. The maximum number for players must be 10. Each player row needs a text input for "name" and a checkbox if the person should be marked as a "dealer". There can be 0, 1 or 2 dealers. When the form is filled out you can click a button for generating the seating. The seating screen must display an outline of a poker table. The poker table must be rectangle and not oval or rounded. The poker table has 10 seats around it where there are 2 seats on each of the short sides of the rectangular poker table and 3 seats on each of the long sides. If there are any dealers they must be placed in the middle seats of each long side. The seats must have sequential numbering from 1 to 10, where the first seat number must be randomized and the rest follows in sequential order. After seating the dealers, the rest of the players must be assigned a random seat. 

---

The form must allow for more than 2 marked dealers. If there are more than 2, the app must randomly pick 2 and the rest must then be treated as regular players.

---

Add the option to go back and edit the players instead of starting over. The edit page can instead have a clear button with a confirm modul before clearing the form.

Add numbering to the input rows to show how many players has been added to the form.

Change the poker table size so the long side with 3 players is actually longer than the short side.

Make sure the seat numbers displays in a clockwise order around the poker table.

Empty seats must not display the text "Empty".

---

When pressing tab or enter while in a "name" text input field, the form should add another row and move focus to the "name" text input field on that new row.

Change the dealer checkbox to a "ios-style" switch button.

---

Rotate the poker table 90 degrees so it is horizontal.

Change the "Player #1" badge to only show the player number (1-10).

---

The poker table was rotated 90 degrees, but the seats did not follow. Rotate the seats as well so there are 3 seats on the top and bottom and 2 seats on each sides. Also the seat numbering is not in a sequential clockwise order.

---

Allow for removing player 1 when there is two or more players added to the form.

---

The seating css is not very good. Use css grid instead of flex. Use a 5x4 grid like shown in 250806110711.png

---

The seat in grid 1/1 must be placed in 1/2, 1/5 must be 1/4, 4/1 must be 4/2 and 4/5 must be 4/4.

---

Save the form input (on change) to localHistory so the state remains after reload

---

Make sure the dealer switch is also saved to localStorage

---

Remove the "Player Name:" form label

---

Pressing tab or enter while in a name input field is adding another row, but the focus is not switching

---

No, the focus is still not switching

---

The form is resetting on restart. If there is data in localStorage the form needs to be populated with that.

---

The pokerPlayers value in localStorage keeps resetting on page load/reload.

---

The dealer checkmark must be saved and kept for all players so when editing players all the original selected dealers is shown.

---

Fix this:
You are running a development build of Vue. Make sure to use the production build (*.prod.js) when deploying for production.

And this error:

Uncaught (in promise) Maximum recursive updates exceeded. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.

Promise.then		
queueFlush	@	vue.esm-browser.js:2559
queueJob	@	vue.esm-browser.js:2554
effect.scheduler	@	vue.esm-browser.js:7665
trigger	@	vue.esm-browser.js:644
endBatch	@	vue.esm-browser.js:702
trigger	@	vue.esm-browser.js:1103
set	@	vue.esm-browser.js:1386
set	@	vue.esm-browser.js:5395
editPlayers	@	App.js:158
callWithErrorHandling	@	vue.esm-browser.js:2440
callWithAsyncErrorHandling	@	vue.esm-browser.js:2447
invoker	@	vue.esm-browser.js:11375

---

The "Start over" button needs a confirmation modal.

Make the player names more visible on the seating.

Make the entire app mobile first. The design should look the same on both mobile and desktop. Maybe consider just using a max width on the top container.

---

export default {
  props: {
    seating: {
      type: Array,
      required: true
    }
  },
  emits: ['update-seating'],
  data() {
    return {
      draggedSeat: null,
      dragOverSeat: null,
      isShiftPressed: false,
      editingSeat: null,
      editingName: '',
      isFullscreen: false
    };
  },
  template: `
    <div :class="{ 'fullscreen-mode': isFullscreen }">
      <div class="poker-table-container" :class="{ 'shift-pressed': isShiftPressed && draggedSeat }">
        <div v-if="!isFullscreen">
          <h2>Seating Arrangement</h2>
          <p class="drag-drop-instruction" :class="{ 'shift-active': isShiftPressed }">
            Drag and drop players to switch seats 
            <span v-if="isShiftPressed" class="shift-indicator">(SHIFT pressed - dealer positions will also switch)</span>
            <span v-else>(hold SHIFT to also switch dealer positions)</span>
          </p>
          <p class="drag-drop-instruction">
            Double-click a player to edit their name
            <span class="instruction-separator">|</span>
            SHIFT + Double-click to make that seat #1
          </p>
          <button @click="toggleFullscreen" class="btn btn-primary fullscreen-btn">
            Enter Fullscreen
          </button>
        </div>
        <button v-if="isFullscreen" @click="toggleFullscreen" class="btn btn-danger exit-fullscreen-btn">
          Exit Fullscreen
        </button>

      <div class="poker-table">
        <!-- Grid layout for the poker table with 5x4 grid -->
        <!-- Top row (positions 0,0 to 4,0) -->
        <div 
          v-for="seat in topSeats" 
          :key="'top-' + seat.index" 
          class="seat"
          :class="{ 
            'dealer-seat': seat.player && seat.player.isDealer,
            'draggable': seat.player,
            'drag-over': dragOverSeat === seat,
            'being-dragged': draggedSeat === seat,
            'editing': editingSeat === seat
          }"
          :style="{ gridColumn: getTopSeatColumn(seat.index), gridRow: '1' }"
          :draggable="!!seat.player && editingSeat !== seat"
          @dragstart="handleDragStart(seat, $event)"
          @dragend="handleDragEnd"
          @dragover="handleDragOver(seat, $event)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(seat, $event)"
          @dblclick="handleDoubleClick(seat, $event)"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div v-if="seat.player && editingSeat !== seat" class="player-name">{{ seat.player.name }}</div>
          <div v-if="seat.player && editingSeat === seat" class="player-name-edit">
            <input 
              type="text" 
              v-model="editingName" 
              @keyup.enter="savePlayerName" 
              @keyup.esc="cancelEditing"
              @blur="savePlayerName"
              ref="nameInput"
              class="name-input"
            />
          </div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>

        <!-- Left side (positions 0,1 to 0,2) -->
        <div 
          v-for="seat in leftSeats" 
          :key="'left-' + seat.index" 
          class="seat"
          :class="{ 
            'dealer-seat': seat.player && seat.player.isDealer,
            'draggable': seat.player,
            'drag-over': dragOverSeat === seat,
            'being-dragged': draggedSeat === seat,
            'editing': editingSeat === seat
          }"
          :style="{ gridColumn: '1', gridRow: getLeftSeatRow(seat.index) }"
          :draggable="!!seat.player && editingSeat !== seat"
          @dragstart="handleDragStart(seat, $event)"
          @dragend="handleDragEnd"
          @dragover="handleDragOver(seat, $event)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(seat, $event)"
          @dblclick="handleDoubleClick(seat, $event)"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div v-if="seat.player && editingSeat !== seat" class="player-name">{{ seat.player.name }}</div>
          <div v-if="seat.player && editingSeat === seat" class="player-name-edit">
            <input 
              type="text" 
              v-model="editingName" 
              @keyup.enter="savePlayerName" 
              @keyup.esc="cancelEditing"
              @blur="savePlayerName"
              ref="nameInput"
              class="name-input"
            />
          </div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>

        <!-- Poker table in the center (positions 2,2 to 4,3) -->
        <div class="table-rectangle">
        </div>

        <!-- Right side (positions 4,1 to 4,2) -->
        <div 
          v-for="seat in rightSeats" 
          :key="'right-' + seat.index" 
          class="seat"
          :class="{ 
            'dealer-seat': seat.player && seat.player.isDealer,
            'draggable': seat.player,
            'drag-over': dragOverSeat === seat,
            'being-dragged': draggedSeat === seat,
            'editing': editingSeat === seat
          }"
          :style="{ gridColumn: '5', gridRow: getRightSeatRow(seat.index) }"
          :draggable="!!seat.player && editingSeat !== seat"
          @dragstart="handleDragStart(seat, $event)"
          @dragend="handleDragEnd"
          @dragover="handleDragOver(seat, $event)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(seat, $event)"
          @dblclick="handleDoubleClick(seat, $event)"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div v-if="seat.player && editingSeat !== seat" class="player-name">{{ seat.player.name }}</div>
          <div v-if="seat.player && editingSeat === seat" class="player-name-edit">
            <input 
              type="text" 
              v-model="editingName" 
              @keyup.enter="savePlayerName" 
              @keyup.esc="cancelEditing"
              @blur="savePlayerName"
              ref="nameInput"
              class="name-input"
            />
          </div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>

        <!-- Bottom row (positions 0,3 to 4,3) -->
        <div 
          v-for="seat in bottomSeats" 
          :key="'bottom-' + seat.index" 
          class="seat"
          :class="{ 
            'dealer-seat': seat.player && seat.player.isDealer,
            'draggable': seat.player,
            'drag-over': dragOverSeat === seat,
            'being-dragged': draggedSeat === seat,
            'editing': editingSeat === seat
          }"
          :style="{ gridColumn: getBottomSeatColumn(seat.index), gridRow: '4' }"
          :draggable="!!seat.player && editingSeat !== seat"
          @dragstart="handleDragStart(seat, $event)"
          @dragend="handleDragEnd"
          @dragover="handleDragOver(seat, $event)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(seat, $event)"
          @dblclick="handleDoubleClick(seat, $event)"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div v-if="seat.player && editingSeat !== seat" class="player-name">{{ seat.player.name }}</div>
          <div v-if="seat.player && editingSeat === seat" class="player-name-edit">
            <input 
              type="text" 
              v-model="editingName" 
              @keyup.enter="savePlayerName" 
              @keyup.esc="cancelEditing"
              @blur="savePlayerName"
              ref="nameInput"
              class="name-input"
            />
          </div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>
      </div>

      <div v-if="!isFullscreen" class="seating-legend mt-4">
        <div class="legend-item">
          <div class="legend-color regular-seat"></div>
          <div>Regular Seat</div>
        </div>
        <div class="legend-item">
          <div class="legend-color dealer-seat-color"></div>
          <div>Dealer Seat</div>
        </div>
      </div>
    </div>
  `,
  computed: {
    topSeats() {
      return this.seating.filter(seat => seat.position === 'top');
    },
    rightSeats() {
      return this.seating.filter(seat => seat.position === 'right');
    },
    bottomSeats() {
      return this.seating.filter(seat => seat.position === 'bottom');
    },
    leftSeats() {
      return this.seating.filter(seat => seat.position === 'left');
    }
  },
  methods: {
    // Toggle fullscreen mode
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;

      // If entering fullscreen mode, cancel any ongoing editing
      if (this.isFullscreen && this.editingSeat) {
        this.cancelEditing();
      }
    },

    // Calculate grid column for top row seats (2, 3, 4)
    getTopSeatColumn(index) {
      // For 3 seats in top row, distribute them across columns 2, 3, 4
      // index 0 -> column 2, index 1 -> column 3, index 2 -> column 4
      return index + 2;
    },
    // Calculate grid row for left side seats (2, 3)
    getLeftSeatRow(index) {
      // For 2 seats on left side, distribute them across rows 2 and 3
      return index + 2;
    },
    // Calculate grid row for right side seats (2, 3)
    getRightSeatRow(index) {
      // For 2 seats on right side, distribute them across rows 2 and 3
      return index + 2;
    },
    // Calculate grid column for bottom row seats (2, 3, 4)
    getBottomSeatColumn(index) {
      // For 3 seats in bottom row, distribute them across columns 2, 3, 4
      // index 0 -> column 2, index 1 -> column 3, index 2 -> column 4
      return index + 2;
    },
    // Drag and drop methods
    handleDragStart(seat, event) {
      // Only allow dragging if the seat has a player
      if (!seat.player) return;

      this.draggedSeat = seat;

      // Set data for drag operation
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({
        position: seat.position,
        index: seat.index
      }));

      // Add a class to the dragged element for visual feedback
      setTimeout(() => {
        event.target.classList.add('being-dragged');
      }, 0);
    },

    handleDragEnd() {
      this.draggedSeat = null;
      this.dragOverSeat = null;
    },

    handleDragOver(seat, event) {
      // Prevent default to allow drop
      event.preventDefault();

      // Set the current seat being dragged over
      this.dragOverSeat = seat;

      // Set the drop effect
      event.dataTransfer.dropEffect = 'move';
    },

    handleDragLeave() {
      this.dragOverSeat = null;
    },

    handleKeyDown(event) {
      if (event.key === 'Shift') {
        this.isShiftPressed = true;
      } else if (event.key === 'Escape' && this.isFullscreen) {
        this.toggleFullscreen();
      }
    },

    handleKeyUp(event) {
      if (event.key === 'Shift') {
        this.isShiftPressed = false;
      }
    },

    handleDrop(targetSeat, event) {
      event.preventDefault();

      // Clear drag over state
      this.dragOverSeat = null;

      // If no seat is being dragged or the target is the same as the source, do nothing
      if (!this.draggedSeat || this.draggedSeat === targetSeat) {
        return;
      }

      // Create a deep copy of the seating array
      const newSeating = JSON.parse(JSON.stringify(this.seating));

      // Find the source and target seats in the new seating array
      const sourceSeat = newSeating.find(s =>
        s.position === this.draggedSeat.position && s.index === this.draggedSeat.index
      );

      const targetSeatInNewArray = newSeating.find(s =>
        s.position === targetSeat.position && s.index === targetSeat.index
      );

      // Check if SHIFT key is pressed
      const isShiftPressed = event.shiftKey;

      if (isShiftPressed) {
        // Original behavior: swap players with their dealer status
        const tempPlayer = sourceSeat.player;
        sourceSeat.player = targetSeatInNewArray.player;
        targetSeatInNewArray.player = tempPlayer;
      } else {
        // New behavior: swap players but keep dealer positions fixed
        // If a player is in a dealer seat, they become a dealer
        // If a dealer is moved to a non-dealer seat, they become a regular player

        // Store original players
        const sourcePlayer = sourceSeat.player ? { ...sourceSeat.player } : null;
        const targetPlayer = targetSeatInNewArray.player ? { ...targetSeatInNewArray.player } : null;

        // Swap players but keep dealer status tied to the seat
        if (sourcePlayer && targetPlayer) {
          // Both seats have players
          const sourceIsDealer = sourceSeat.player.isDealer;
          const targetIsDealer = targetSeatInNewArray.player.isDealer;

          // Swap players but assign dealer status based on seat
          sourceSeat.player = {
            ...targetPlayer,
            isDealer: sourceIsDealer
          };

          targetSeatInNewArray.player = {
            ...sourcePlayer,
            isDealer: targetIsDealer
          };
        } else if (sourcePlayer) {
          // Only source seat has a player
          targetSeatInNewArray.player = {
            ...sourcePlayer,
            isDealer: targetSeatInNewArray.player ? targetSeatInNewArray.player.isDealer : false
          };
          sourceSeat.player = null;
        } else if (targetPlayer) {
          // Only target seat has a player
          sourceSeat.player = {
            ...targetPlayer,
            isDealer: sourceSeat.player ? sourceSeat.player.isDealer : false
          };
          targetSeatInNewArray.player = null;
        }
      }

      // Emit the updated seating to the parent component
      this.$emit('update-seating', newSeating);

      // Reset drag state
      this.draggedSeat = null;
    },

    // Double-click methods
    handleDoubleClick(seat, event) {
      // Only allow editing if the seat has a player
      if (!seat.player) return;

      // Check if SHIFT key is pressed
      if (event.shiftKey) {
        // SHIFT + double-click: make this seat the first seat (#1)
        this.rearrangeSeats(seat);
      } else {
        // Regular double-click: edit player name
        this.editingSeat = seat;
        this.editingName = seat.player.name;

        // Focus the input field after it's rendered
        this.$nextTick(() => {
          if (this.$refs.nameInput) {
            this.$refs.nameInput.focus();
          }
        });
      }
    },

    savePlayerName() {
      if (!this.editingSeat || !this.editingSeat.player) return;

      // Create a deep copy of the seating array
      const newSeating = JSON.parse(JSON.stringify(this.seating));

      // Find the seat being edited in the new seating array
      const seatToUpdate = newSeating.find(s =>
        s.position === this.editingSeat.position && s.index === this.editingSeat.index
      );

      if (seatToUpdate && seatToUpdate.player) {
        // Update the player name
        seatToUpdate.player.name = this.editingName.trim();

        // Emit the updated seating to the parent component
        this.$emit('update-seating', newSeating);
      }

      // Reset editing state
      this.editingSeat = null;
      this.editingName = '';
    },

    cancelEditing() {
      // Reset editing state without saving changes
      this.editingSeat = null;
      this.editingName = '';
    },

    handleDocumentClick(event) {
      // If not in editing mode, do nothing
      if (!this.editingSeat) return;

      // Check if the click was inside an input element or inside the editing seat
      const isClickInsideInput = event.target.tagName === 'INPUT';
      const isClickInsideEditingSeat = event.target.closest('.editing');

      // If the click was outside both the input and the editing seat, cancel editing
      if (!isClickInsideInput && !isClickInsideEditingSeat) {
        this.cancelEditing();
      }
    },

    rearrangeSeats(firstSeat) {
      // Create a deep copy of the seating array
      const newSeating = JSON.parse(JSON.stringify(this.seating));

      // Find the seat that will be the new first seat
      const newFirstSeat = newSeating.find(s =>
        s.position === firstSeat.position && s.index === firstSeat.index
      );

      if (!newFirstSeat) return;

      // Get the current seat number of the new first seat
      const newFirstSeatNumber = newFirstSeat.seatNumber;

      // Calculate the offset for renumbering
      const offset = 1 - newFirstSeatNumber;

      // If offset is 0, no need to renumber
      if (offset === 0) return;

      // Renumber all seats
      newSeating.forEach(seat => {
        // Calculate new seat number
        let newNumber = seat.seatNumber + offset;

        // Ensure the number is between 1 and 10
        if (newNumber <= 0) newNumber += 10;
        if (newNumber > 10) newNumber -= 10;

        seat.seatNumber = newNumber;
      });

      // Emit the updated seating to the parent component
      this.$emit('update-seating', newSeating);
    }
  },
  mounted() {
    // Add event listeners for keydown and keyup to track SHIFT key state
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Add click event listener to handle clicks outside the editing seat
    document.addEventListener('click', this.handleDocumentClick);
  },
  beforeUnmount() {
    // Remove event listeners when component is unmounted
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('click', this.handleDocumentClick);
  }
};

export default {
  props: {
    seating: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="poker-table-container">
      <h2>Seating Arrangement</h2>

      <div class="poker-table">
        <!-- Grid layout for the poker table with 5x4 grid -->
        <!-- Top row (positions 0,0 to 4,0) -->
        <div 
          v-for="seat in topSeats" 
          :key="'top-' + seat.index" 
          class="seat"
          :class="{ 'dealer-seat': seat.player && seat.player.isDealer }"
          :style="{ gridColumn: getTopSeatColumn(seat.index), gridRow: '1' }"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div class="player-name" v-if="seat.player">{{ seat.player.name }}</div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>

        <!-- Left side (positions 0,1 to 0,2) -->
        <div 
          v-for="seat in leftSeats" 
          :key="'left-' + seat.index" 
          class="seat"
          :class="{ 'dealer-seat': seat.player && seat.player.isDealer }"
          :style="{ gridColumn: '1', gridRow: getLeftSeatRow(seat.index) }"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div class="player-name" v-if="seat.player">{{ seat.player.name }}</div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>

        <!-- Poker table in the center (positions 2,2 to 4,3) -->
        <div class="table-rectangle">
          <div class="table-label">Poker Table</div>
        </div>

        <!-- Right side (positions 4,1 to 4,2) -->
        <div 
          v-for="seat in rightSeats" 
          :key="'right-' + seat.index" 
          class="seat"
          :class="{ 'dealer-seat': seat.player && seat.player.isDealer }"
          :style="{ gridColumn: '5', gridRow: getRightSeatRow(seat.index) }"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div class="player-name" v-if="seat.player">{{ seat.player.name }}</div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>

        <!-- Bottom row (positions 0,3 to 4,3) -->
        <div 
          v-for="seat in bottomSeats" 
          :key="'bottom-' + seat.index" 
          class="seat"
          :class="{ 'dealer-seat': seat.player && seat.player.isDealer }"
          :style="{ gridColumn: getBottomSeatColumn(seat.index), gridRow: '4' }"
        >
          <div class="seat-number">{{ seat.seatNumber }}</div>
          <div class="player-name" v-if="seat.player">{{ seat.player.name }}</div>
          <div v-if="seat.player && seat.player.isDealer" class="dealer-tag">Dealer</div>
        </div>
      </div>

      <div class="seating-legend mt-4">
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
    }
  }
};

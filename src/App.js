import PlayerForm from './components/PlayerForm.js';
import PokerTable from './components/PokerTable.js';

export default {
  components: {
    PlayerForm,
    PokerTable
  },
  template: `
    <div class="container">
      <h1>Poker Seating Randomizer</h1>

      <div v-if="!showSeating">
        <PlayerForm 
          @generate-seating="generateSeating" 
          :players="players" 
          @update-players="updatePlayers"
        />
      </div>

      <div v-else>
        <PokerTable :seating="seating" />
        <div class="mt-3">
          <button @click="editPlayers" class="btn btn-secondary me-2">Edit Players</button>
          <button @click="showResetModal" class="btn btn-primary">Start Over</button>
        </div>
      </div>

      <!-- Reset Confirmation Modal -->
      <div v-if="showResetConfirmation" class="modal-overlay">
        <div class="modal-content">
          <h3>Confirm Reset</h3>
          <p>Are you sure you want to start over? All player data will be cleared.</p>
          <div class="modal-buttons">
            <button @click="resetForm" class="btn btn-danger me-2">Yes, Start Over</button>
            <button @click="hideResetModal" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      players: [{ name: '', isDealer: false }],
      originalPlayers: [], // Store original players with all dealer selections
      showSeating: false,
      seating: [],
      showResetConfirmation: false
    };
  },
  methods: {
    showResetModal() {
      this.showResetConfirmation = true;
    },
    hideResetModal() {
      this.showResetConfirmation = false;
    },
    updatePlayers(newPlayers) {
      this.players = newPlayers;
      this.originalPlayers = JSON.parse(JSON.stringify(newPlayers)); // Deep copy to preserve all dealer selections
      localStorage.setItem('pokerPlayers', JSON.stringify(newPlayers));
      localStorage.setItem('originalPokerPlayers', JSON.stringify(newPlayers)); // Save original players with all dealer selections
    },
    generateSeating(players) {
      // Get all dealers
      let dealers = players.filter(player => player.isDealer);
      let nonDealers = players.filter(player => !player.isDealer);

      // If there are more than 2 dealers, randomly select 2 and treat the rest as regular players
      if (dealers.length > 2) {
        // Shuffle the dealers array
        console.log(JSON.parse(JSON.stringify(dealers)));
        dealers = [...dealers].sort(() => Math.random() - 0.5);
        console.log(JSON.parse(JSON.stringify(dealers)));

        // Take the first 2 as dealers
        const selectedDealers = dealers.slice(0, 2);

        // Add the rest to nonDealers, but mark them as non-dealers
        const extraDealers = dealers.slice(2).map(player => ({
          ...player,
          isDealer: false
        }));

        nonDealers = [...nonDealers, ...extraDealers];
        dealers = selectedDealers;
      }

      // Create a modified players array with the correct dealer assignments
      const modifiedPlayers = [...dealers, ...nonDealers];

      // Update the players property and save to localStorage
      this.players = modifiedPlayers;
      localStorage.setItem('pokerPlayers', JSON.stringify(modifiedPlayers));

      // Define seat positions (3 on long sides, 2 on short sides) in clockwise order
      const seats = [
        { position: 'top', index: 0 },     // Long side - left
        { position: 'top', index: 1 },     // Long side - middle
        { position: 'top', index: 2 },     // Long side - right
        { position: 'right', index: 0 },   // Short side - top
        { position: 'right', index: 1 },   // Short side - bottom
        { position: 'bottom', index: 2 },  // Long side - right
        { position: 'bottom', index: 1 },  // Long side - middle
        { position: 'bottom', index: 0 },  // Long side - left
        { position: 'left', index: 1 },    // Short side - bottom
        { position: 'left', index: 0 }     // Short side - top
      ];

      // Randomize starting seat number (1-10)
      const startingSeatNumber = Math.floor(Math.random() * 10) + 1;

      // Assign seat numbers
      const seatNumbers = [];
      for (let i = 0; i < 10; i++) {
        const seatNumber = ((startingSeatNumber - 1 + i) % 10) + 1;
        seatNumbers.push(seatNumber);
      }

      // Create a copy of seats with seat numbers
      const seatsWithNumbers = seats.map((seat, index) => ({
        ...seat,
        seatNumber: seatNumbers[index]
      }));

      // Assign dealers to middle seats of long sides
      const dealerSeats = [1, 6]; // Indices of middle seats on long sides (top and bottom)
      const assignedSeats = [];

      // Place dealers first
      dealers.forEach((dealer, index) => {
        if (index < dealerSeats.length) {
          const seatIndex = dealerSeats[index];
          assignedSeats.push(seatIndex);
          seatsWithNumbers[seatIndex].player = dealer;
        }
      });

      // Shuffle remaining players
      const shuffledNonDealers = [...nonDealers].sort(() => Math.random() - 0.5);

      // Assign remaining players to random seats
      let nonDealerIndex = 0;
      for (let i = 0; i < seatsWithNumbers.length; i++) {
        if (!assignedSeats.includes(i)) {
          if (nonDealerIndex < shuffledNonDealers.length) {
            seatsWithNumbers[i].player = shuffledNonDealers[nonDealerIndex];
            nonDealerIndex++;
            assignedSeats.push(i);
          } else {
            // Empty seat
            seatsWithNumbers[i].player = null;
          }
        }
      }

      this.seating = seatsWithNumbers;
      this.showSeating = true;

      // Save state to localStorage
      localStorage.setItem('pokerSeating', JSON.stringify(seatsWithNumbers));
      localStorage.setItem('pokerShowSeating', 'true');
    },
    resetForm() {
      this.players = [{ name: '', isDealer: false }];
      this.originalPlayers = []; // Clear original players
      this.showSeating = false;
      this.seating = [];

      // Clear localStorage
      localStorage.removeItem('pokerPlayers');
      localStorage.removeItem('originalPokerPlayers'); // Clear original players from localStorage
      localStorage.removeItem('pokerSeating');
      localStorage.removeItem('pokerShowSeating');
    },
    editPlayers() {
      this.seating = [];
      localStorage.removeItem('pokerSeating');
      this.showSeating = false;
      localStorage.removeItem('pokerShowSeating');

      // Restore original players with all dealer selections
      if (this.originalPlayers.length > 0) {
        this.players = JSON.parse(JSON.stringify(this.originalPlayers));
        localStorage.setItem('pokerPlayers', JSON.stringify(this.players));
      }
    }
  },
  beforeMount() {
    // Load data from localStorage
    const savedPlayers = localStorage.getItem('pokerPlayers');
    const savedOriginalPlayers = localStorage.getItem('originalPokerPlayers');
    const savedSeating = localStorage.getItem('pokerSeating');
    const savedShowSeating = localStorage.getItem('pokerShowSeating');

    if (savedPlayers) {
      this.players = JSON.parse(savedPlayers);
    }

    if (savedOriginalPlayers) {
      this.originalPlayers = JSON.parse(savedOriginalPlayers);
    } else if (savedPlayers) {
      // If no original players are saved but we have players, use those as original
      this.originalPlayers = JSON.parse(savedPlayers);
    }

    if (savedSeating) {
      this.seating = JSON.parse(savedSeating);
    }

    if (savedShowSeating) {
      this.showSeating = savedShowSeating === 'true';
    }
  }
};

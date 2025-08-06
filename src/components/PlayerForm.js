export default {
  props: {
    players: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="player-form">
      <h2>Enter Players</h2>

      <div v-for="(player, index) in localPlayers" :key="index" class="player-row mb-3">
        <div class="player-number">{{ index + 1 }}</div>
        <div class="d-flex align-items-center">
          <div class="me-3">
            <input 
              type="text" 
              :id="'player-name-' + index" 
              v-model="player.name" 
              class="form-control"
              @input="updatePlayers"
              @keydown="handleKeyDown($event, index)"
              placeholder="Enter name"
            >
          </div>

          <div class="switch-container ms-3">
            <label class="switch">
              <input 
                type="checkbox" 
                :id="'player-dealer-' + index" 
                v-model="player.isDealer" 
                @change="validateDealers(index)"
              >
              <span class="slider round"></span>
            </label>
            <label :for="'player-dealer-' + index" class="switch-label">Dealer</label>
          </div>

          <button 
            v-if="localPlayers.length > 1" 
            @click="removePlayer(index)" 
            class="btn btn-danger ms-3"
            type="button"
          >
            Remove
          </button>
        </div>

      </div>

      <div class="mt-3 mb-4">
        <button 
          @click="addPlayer" 
          class="btn btn-secondary me-2" 
          :disabled="localPlayers.length >= 10"
          type="button"
        >
          Add Player
        </button>
        <span v-if="localPlayers.length >= 10" class="text-muted">
          Maximum 10 players reached
        </span>
      </div>

      <div class="validation-errors mb-3">
        <div v-if="nameError" class="text-danger">
          All players must have a name
        </div>
      </div>

      <div class="d-flex">
        <button 
          @click="generateSeating" 
          class="btn btn-primary me-2" 
          :disabled="!isFormValid"
          type="button"
        >
          Generate Seating
        </button>
        <button 
          @click="showClearModal" 
          class="btn btn-danger" 
          type="button"
        >
          Clear Form
        </button>
      </div>

      <!-- Clear Confirmation Modal -->
      <div v-if="showClearConfirmation" class="modal-overlay">
        <div class="modal-content">
          <h3>Confirm Clear</h3>
          <p>Are you sure you want to clear all players?</p>
          <div class="modal-buttons">
            <button @click="clearForm" class="btn btn-danger me-2">Yes, Clear All</button>
            <button @click="hideClearModal" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      localPlayers: [...this.players],
      nameError: false,
      showClearConfirmation: false,
      focusIndex: -1,
      isUpdatingFromProps: false
    };
  },
  computed: {
    isFormValid() {
      return !this.nameError && this.localPlayers.length > 0 &&
             this.localPlayers.every(player => player.name.trim() !== '');
    },
    dealerCount() {
      return this.localPlayers.filter(player => player.isDealer).length;
    }
  },
  watch: {
    players: {
      handler(newVal) {
        this.isUpdatingFromProps = true;
        this.localPlayers = [...newVal];
        this.$nextTick(() => {
          this.isUpdatingFromProps = false;
        });
      },
      deep: true
    },
    localPlayers: {
      handler() {
        this.validateForm();
      },
      deep: true
    },
    focusIndex: {
      handler(newIndex) {
        if (newIndex >= 0) {
          // Use a longer timeout to ensure the DOM has fully updated
          setTimeout(() => {
            const newInput = document.getElementById(`player-name-${newIndex}`);
            if (newInput) {
              newInput.focus();
              // Try focusing again after a short delay
              setTimeout(() => {
                newInput.focus();
              }, 50);
            }
            // Reset the focusIndex after focusing
            this.focusIndex = -1;
          }, 200);
        }
      }
    }
  },
  methods: {
    addPlayer() {
      if (this.localPlayers.length < 10) {
        this.localPlayers.push({ name: '', isDealer: false });
        this.updatePlayers();
        // Get the index of the newly added player
        const newIndex = this.localPlayers.length - 1;
        // Return the index of the newly added player
        return newIndex;
      }
      return -1;
    },
    handleKeyDown(event, index) {
      // Check if the key pressed is Tab or Enter
      if ((event.key === 'Tab' && !event.shiftKey) || event.key === 'Enter') {
        // If we're at the maximum number of players, don't add a new row
        if (this.localPlayers.length >= 10) {
          return;
        }

        // Prevent the default behavior (moving to the next field or submitting the form)
        event.preventDefault();

        // Store the current active element to check if it's still active after adding a new player
        const activeElement = document.activeElement;

        // Add a new player
        const newIndex = this.addPlayer();

        // If a new player was successfully added, try multiple approaches to focus on the new input field
        if (newIndex !== -1) {
          // Set the focusIndex to trigger the watcher
          this.focusIndex = newIndex;

          // Also try direct DOM manipulation with multiple timeouts
          const focusNewInput = () => {
            const newInput = document.getElementById(`player-name-${newIndex}`);
            if (newInput) {
              // Try to focus
              newInput.focus();

              // Check if focus was successful
              if (document.activeElement !== newInput) {
                // If not, try again with click() which can sometimes help with focus issues
                newInput.click();
                newInput.focus();
              }
            }
          };

          // Try focusing immediately
          focusNewInput();

          // Try again after a short delay
          setTimeout(focusNewInput, 50);

          // And again after a longer delay
          setTimeout(focusNewInput, 300);
        }
      }
    },
    removePlayer(index) {
      this.localPlayers.splice(index, 1);
      this.updatePlayers();
      this.validateDealers();
    },
    validateDealers() {
      // No longer need to enforce a maximum of 2 dealers
      // The App component will handle randomly selecting 2 dealers if more than 2 are marked

      // Update players to save dealer status to localStorage
      this.updatePlayers();
    },
    validateForm() {
      this.nameError = this.localPlayers.some(player => player.name.trim() === '');
      this.validateDealers();
    },
    updatePlayers() {
      // Only emit the event if the update is not coming from a prop change
      if (!this.isUpdatingFromProps) {
        this.$emit('update-players', [...this.localPlayers]);
      }
    },
    generateSeating() {
      if (this.isFormValid) {
        this.$emit('generate-seating', this.localPlayers);
      }
    },
    showClearModal() {
      this.showClearConfirmation = true;
    },
    hideClearModal() {
      this.showClearConfirmation = false;
    },
    clearForm() {
      this.localPlayers = [{ name: '', isDealer: false }];
      this.updatePlayers();
      this.hideClearModal();
    }
  },
  mounted() {
    // Initialize localPlayers from players prop
    this.isUpdatingFromProps = true;
    this.localPlayers = [...this.players];
    // Initialize validation
    this.validateForm();
    this.$nextTick(() => {
      this.isUpdatingFromProps = false;
    });
  }
};

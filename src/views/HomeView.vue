<template>
  <div id="homeForm" class="bg-sky-950 h-screen overflow-auto px-4 font-sans">
    <main class="flex flex-col justify-evenly items-start h-full">
      <img src="../assets/imgs/toucy.svg" alt="" />
      <div class="flex justify-center items-center w-full px-6 gap-10">
        <!-- Nombre aligné à gauche (Montant récolté) -->
        <p class="text-3xl font-bold text-sky-50">
          {{ collectedAmount }} € <br />récoltés
        </p>

        <!-- consos restantes -->
        <div class="flex flex-col items-center">
          <!-- Affichage du nombre de consos restantes ou input pour la modification -->
          <p
            v-if="!isEditing"
            class="text-2xl font-bold text-sky-50 cursor-pointer"
            @click="startEditing"
          >
            {{ remainingConsos }} <br />consos restantes
          </p>
          <input
            v-else
            type="number"
            v-model="inputConsos"
            class="text-2xl font-bold text-sky-800 bg-white rounded-lg p-2 text-center w-20"
            @blur="stopEditing"
            @keydown.enter="stopEditing"
          />

          <!-- Boutons pour ajouter/enlever une conso -->
          <div class="flex mt-2 gap-10 justify-start w-full">
            <button
              @click="decreaseConsos"
              class="px-3 py-1 bg-sky-400 text-white rounded-lg hover:bg-sky-600"
            >
              -
            </button>
            <button
              @click="increaseConsos"
              class="px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-800"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Cards container -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Card 1: Ajouter une tournée -->
        <div
          class="flex flex-col items-center p-6 bg-sky-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToFormAddView"
        >
          <!-- Cercle autour de l'icône -->
          <div
            class="flex items-center justify-center w-16 h-16 bg-rose-200 rounded-full mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-rose-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <!-- Texte sous l'icône -->
          <span class="text-lg text-center font-semibold text-sky-950"
            >Ajouter une tournée</span
          >
        </div>

        <!-- Card 2: Payer une dette -->
        <div
          class="flex flex-col items-center p-6 bg-sky-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToFormDetteView"
        >
          <!-- Cercle autour de l'icône, parfaitement centré -->
          <div
            class="flex items-center justify-center w-16 h-16 bg-lime-200 rounded-full mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-lime-800"
              fill="none"
              viewBox="0 0 26 26"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 14l6-6m0 0l6 6m-6-6v12"
              />
            </svg>
          </div>
          <!-- Texte sous l'icône -->
          <span class="text-lg text-center font-semibold text-sky-950"
            >Payer une dette</span
          >
        </div>

        <!-- Card 3: Voir le tableau de bord -->
        <div
          class="flex flex-col items-center p-6 bg-sky-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToDashboardView"
        >
          <div
            class="flex items-center justify-center w-16 h-16 bg-indigo-200 rounded-full mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-indigo-800 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </div>
          <span class="text-lg text-center font-semibold text-sky-950"
            >Voir le tableau de bord</span
          >
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collectedAmount: 123, // Montant récolté
      remainingConsos: 12, // Nombre de consos restantes
      inputConsos: 12, // Valeur de l'input pour modifier le nombre de consos
      isEditing: false, // Mode édition activé ou non
    }
  },
  methods: {
    goToFormAddView() {
      this.$router.push('/formAddView')
    },
    goToFormDetteView() {
      this.$router.push('/formDetteView')
    },
    goToDashboardView() {
      this.$router.push('/dashboardView')
    },
    // Commence le mode d'édition
    startEditing() {
      this.isEditing = true
    },
    // Quitte le mode d'édition et met à jour le nombre de consos
    stopEditing() {
      this.remainingConsos =
        parseInt(this.inputConsos, 10) || this.remainingConsos
      this.isEditing = false
    },
    // Ajoute une conso
    increaseConsos() {
      this.remainingConsos++
      this.inputConsos = this.remainingConsos
    },
    // Enlève une conso
    decreaseConsos() {
      if (this.remainingConsos > 0) {
        this.remainingConsos--
        this.inputConsos = this.remainingConsos
      }
    },
  },
  name: 'HomeView',
}
</script>

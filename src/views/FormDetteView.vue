<template>
  <div id="home" class="min-h-screen bg-sky-950 p-6">
    <header
      class="flex items-center justify-start gap-10 text-white p-4 rounded mb-6"
    >
      <button
        @click="goHome"
        class="flex items-center justify-center w-10 h-10 bg-sky-50 text-sky-950 rounded-full hover:bg-gray-700 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="text-xl font-semibold">Payez une Dette !</h1>
    </header>

    <main class="bg-sky-50 p-6 rounded shadow-md">
      <!-- Liste des dettes par membre -->
      <div class="mb-4">
        <label class="block text-sky-950 font-medium mb-2" for="personne">
          👤 Choisissez une dette :
        </label>
        <select
          v-model="selectedPersonne"
          @change="updateMontantsDisponibles"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option
            v-for="personne in personnesAvecDette"
            :key="personne.name"
            :value="personne"
          >
            {{ personne.name }} ({{ personne.montantDette }}€ de dette)
          </option>
        </select>
      </div>

      <!-- Sélection du montant -->
      <montant-choice
        :montants="montantsDisponibles"
        @montant-selected="handleMontantSelection"
      ></montant-choice>

      <!-- Liste des moyens de paiement -->
      <div class="mt-4">
        <label class="block text-sky-950 font-medium mb-2">
          💳 Choisissez un moyen de paiement :
        </label>
        <ListChoice :items="moyensPaiement" @onSelect="handlePaiementSelect" />
      </div>

      <!-- Récapitulatif -->
      <div class="mt-6">
        <p class="text-sky-950 font-medium">🍻 Récapitulatif :</p>
        <p
          v-if="montantTournée && nomPersonne && moyenPaiement"
          class="text-sky-950"
        >
          Une dette de
          <span class="font-semibold">{{ montantTournée }}€</span> est
          remboursée par
          <span class="font-semibold">{{ nomPersonne }}</span> avec
          <span class="font-semibold">{{ moyenPaiement }}</span> !
        </p>
        <p v-else class="text-sky-950">
          Sélectionnez une personne, un montant et un moyen de paiement pour
          voir le récapitulatif.
        </p>
      </div>

      <!-- Bouton de validation -->
      <button
        @click="saveTournee"
        class="w-full mt-6 bg-sky-950 text-sky-50 py-3 rounded hover:bg-gray-800 transition duration-200"
      >
        Valider
      </button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'formDetteView',
  data() {
    return {
      selectedPersonne: null,
      personnesAvecDette: [
        { name: 'Adrien', montantDette: 50 },
        { name: 'Marie', montantDette: 30 },
      ],
      montantsDisponibles: [5, 10, 15, 20],
      montantTournée: null,
      nomPersonne: null,
      moyenPaiement: null,
      moyensPaiement: ['Carte', 'Espèces', 'Chèque'],
    }
  },
  methods: {
    updateMontantsDisponibles() {
      // Logic to update available amounts based on selected person
    },
    handleMontantSelection(montant) {
      this.montantTournée = montant
    },
    handlePaiementSelect(paiement) {
      this.moyenPaiement = paiement
    },
    saveTournee() {
      console.log('Tournée validée')
    },
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>

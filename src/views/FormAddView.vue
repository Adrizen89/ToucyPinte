<template>
  <div class="min-h-screen bg-sky-950 p-4 md:p-6">
    <header
      class="flex items-center justify-start gap-10 text-sky-50 p-3 md:p-4 rounded mb-4 md:mb-6"
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
      <h1 class="text-lg md:text-xl font-semibold">Ajouter une tournée</h1>
    </header>

    <main class="bg-sky-50 p-6 rounded shadow-md">
      <div class="mb-4">
        <label class="block text-sky-950 mb-1">Choisir une personne :</label>
        <select
          v-model="selectedMembre"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
        >
          <option
            v-for="membre in filteredMembres"
            :key="membre.name"
            :value="membre"
          >
            {{ membre.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sky-950 mb-1">Choisir un montant :</label>
        <select
          v-model="selectedMontant"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
        >
          <option
            v-for="montant in montantsDisponibles"
            :key="montant"
            :value="montant"
          >
            {{ montant }}
          </option>
        </select>
      </div>

      <div
        v-if="isCustomMontant"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white p-4 rounded shadow-md w-64">
          <h3 class="text-gray-700 mb-4">Montant personnalisé</h3>
          <input
            type="number"
            v-model="customMontant"
            class="w-full border border-sky-200 rounded px-3 py-2 mb-4 focus:outline-none focus:border-gray-400"
            placeholder="Entrez un montant"
          />
          <button
            @click="validateCustomMontant"
            class="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
          >
            Valider
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            v-model="tourneePayee"
            class="form-checkbox text-sky-950"
          />
          <span class="ml-2 text-sky-950">Tournée payée ?</span>
        </label>
      </div>

      <div v-if="tourneePayee" class="mb-4">
        <label class="block text-sky-950 mb-1">Mode de paiement :</label>
        <select
          v-model="selectedPaiement"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
        >
          <option
            v-for="paiement in moyensPaiement"
            :key="paiement"
            :value="paiement"
          >
            {{ paiement }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <p class="text-sky-950 font-semibold">Récapitulatif :</p>
        <p v-if="tourneePayee">
          Une tournée de <span class="font-bold">{{ montantTournée }}</span> €
          est payée par <span class="font-bold">test</span> avec
          <span class="font-bold">{{ selectedPaiement }}</span> !
        </p>
        <p v-else>
          Une dette de <span class="font-bold">{{ montantTournée }}</span> € est
          attribuée à <span class="font-bold">test</span> !
        </p>
      </div>

      <button
        @click="saveTournee"
        class="w-full bg-sky-950 text-sky-50 py-2 rounded hover:bg-gray-800 transition"
      >
        Valider
      </button>
    </main>
  </div>
</template>

<script>
import { db } from '@/firebase/index'
import { collection, getDocs, addDoc } from 'firebase/firestore'
export default {
  data() {
    return {
      selectedMembre: null,
      filteredMembres: [],
      montantsDisponibles: [5, 10, 15, 20, 'Autre'],
      selectedMontant: null,
      customMontant: null,
      isCustomMontant: false,
      tourneePayee: false,
      selectedPaiement: null,
      moyensPaiement: ['Lydia', 'Espèces', 'Paylib'],
      montantTournée: null,
    }
  },
  watch: {
    selectedMontant(val) {
      this.isCustomMontant = val === 'Autre'
      if (val !== 'Autre') this.montantTournée = val
    },
    customMontant(val) {
      this.montantTournée = val
    },
  },
  methods: {
    async fetchMembres() {
      try {
        const membresCollection = collection(db, 'membres')
        const membresSnapshot = await getDocs(membresCollection)
        this.membres = membresSnapshot.docs.map(doc => ({
          name: doc.data().name,
        }))
        this.filteredMembres = this.membres
      } catch (error) {
        console.error('Erreur lors de la récupération des membres :', error)
      }
    },
    async addNewPersonne(nom) {
      try {
        if (!nom) {
          throw new Error('Le nom de la personne est manquant.')
        }

        // Ajouter la nouvelle personne dans Firestore
        const docRef = await addDoc(collection(db, 'membres'), {
          name: nom, // Assurez-vous que le nom est bien passé
          isResp: false,
        })

        console.log('Nouveau membre ajouté avec ID:', docRef.id)

        // Ajouter le nouveau membre dans la liste des membres disponibles
        this.membres.push(nom)

        this.selectedMembre = nom

        // Réinitialiser la sélection dans le composant ListChoice
        this.$refs.personSelect.resetSelect()
        this.$refs.personSelect.selectedItem = nom

        alert(`${nom} a été ajouté avec succès !`)
      } catch (error) {
        console.error("Erreur lors de l'ajout d'un nouveau membre :", error)
      }
    },
    async saveTournee() {
      if (
        !this.selectedMembre ||
        !this.montantTournée ||
        this.montantTournée <= 0
      ) {
        alert('Veuillez sélectionner un membre et un montant.')
        return
      }

      try {
        // Ajout de la nouvelle tournée dans Firestore
        const docRef = await addDoc(collection(db, 'tournees'), {
          name: this.selectedMembre.name,
          montant: this.montantTournée,
          paye: this.tourneePayee,
          dette: !this.tourneePayee,
          moyen: this.tourneePayee ? this.selectedPaiement : '',
          date: new Date().toLocaleDateString(),
          ...(this.tourneePayee === false
            ? { montantDette: this.montantTournée }
            : {}),
        })

        console.log("Document ajouté avec l'ID : ", docRef.id)
        alert('Tournée enregistrée avec succès !')
        this.resetForm()
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la tournée :", error)
      }
    },

    validateCustomMontant() {
      this.isCustomMontant = false
    },
    goHome() {
      this.$router.push('/')
    },
  },
  mounted() {
    this.fetchMembres()
  },
}
</script>

<template>
  <div
    class="min-h-screen bg-sky-950 p-4 md:p-6 w-full flex flex-col justify-start items-center"
  >
    <header
      class="flex items-center justify-center text-light p-3 md:p-4 rounded mb-4 md:mb-6"
    >
      <button
        @click="goHome"
        class="flex items-center justify-center w-10 h-10 bg-midnight text-sky-950 rounded-full hover:bg-gray-700 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#FFF"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <img class="w-7/12" src="../assets/imgs/toucy.svg" alt="" />
    </header>

    <main class="bg-midnight p-6 rounded shadow-md w-3/4">
      <div class="mb-4">
        <h1 class="text-xl text-light font-semibold text-center mb-8">
          Ajoutez une tournée !
        </h1>
        <!-- Champ de recherche et liste déroulante -->
        <label class="block text-light mb-1">Rechercher une personne :</label>
        <div class="relative" ref="container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tapez pour rechercher..."
            class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
            @focus="showDropdown = true"
            @blur="handleBlur"
          />

          <!-- Liste déroulante des résultats filtrés -->
          <ul
            v-if="showDropdown && filteredMembres.length > 0"
            class="absolute bg-light border border-midnight rounded w-full mt-1 shadow-lg z-10"
          >
            <li
              v-for="(membre, index) in filteredMembres"
              :key="index"
              @mousedown.prevent="selectMembre(membre)"
              class="px-3 py-2 hover:bg-sky-100 cursor-pointer"
            >
              {{ membre.name }}
            </li>
            <!-- Option pour ajouter un nouveau membre -->
            <li
              @mousedown.prevent="openAddMembreModal"
              class="px-3 py-2 hover:bg-light cursor-pointer text-midnight italic"
            >
              Ajouter un nouveau membre
            </li>
          </ul>
        </div>

        <!-- Modale pour ajouter un nouveau membre -->
        <div
          v-if="showAddMembreModal"
          class="fixed inset-0 bg-midnight bg-opacity-90 flex justify-center items-center z-20"
        >
          <div class="bg-dark p-4 rounded shadow-md w-64">
            <h3 class="text-light mb-4">Ajouter un nouveau membre</h3>
            <input
              type="text"
              v-model="newMembreName"
              class="w-full border border-sky-200 rounded px-3 py-2 mb-4 focus:outline-none focus:border-gray-400"
              placeholder="Nom du membre"
            />
            <button
              @click="addNewPersonne(newMembreName)"
              class="w-full bg-accent text-light py-2 rounded hover:bg-gray-800"
            >
              Ajouter
            </button>
            <button
              @click="showAddMembreModal = false"
              class="w-full text-light py-2 rounded hover:bg-gray-200 mt-2"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-light mb-1">Choisir un montant :</label>
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
        class="fixed inset-0 bg-midnight bg-opacity-90 flex justify-center items-center"
      >
        <div class="bg-dark p-4 rounded shadow-md w-64">
          <h3 class="text-light mb-4">Montant personnalisé</h3>
          <input
            type="number"
            v-model="customMontant"
            class="w-full border border-sky-200 rounded px-3 py-2 mb-4 focus:outline-none focus:border-gray-400"
            placeholder="Entrez un montant"
          />
          <button
            @click="validateCustomMontant"
            class="w-full bg-accent text-light py-2 rounded hover:bg-gray-800"
          >
            Valider
          </button>
          <button
            @click="isCustomMontant = false"
            class="w-full text-light py-2 rounded hover:bg-gray-200 mt-2"
          >
            Annuler
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
          <span class="ml-2 text-light">Tournée payée ?</span>
        </label>
      </div>

      <div v-if="tourneePayee" class="mb-4">
        <label class="block text-light mb-1">Mode de paiement :</label>
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
        <p class="text-light font-semibold">Récapitulatif :</p>
        <p v-if="tourneePayee" class="text-light">
          Une tournée de
          <span class="font-bold">{{ montantTournée ?? 0 }}</span> € est payée
          par
          <span class="font-bold">{{
            selectedMembre?.name || 'personne'
          }}</span>
          avec <span class="font-bold">{{ selectedPaiement ?? 'rien' }}</span> !
        </p>
        <p v-else class="text-light">
          Une dette de
          <span class="font-bold">{{ montantTournée ?? 0 }}</span> € est
          attribuée à
          <span class="font-bold">{{
            selectedMembre?.name || 'personne'
          }}</span>
          !
        </p>
      </div>

      <button
        @click="saveTournee"
        class="w-full bg-accent text-light py-2 rounded hover:bg-gray-800 transition"
      >
        Valider
      </button>
    </main>
  </div>
</template>

<script>
import { db } from '@/firebase/index'
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore'
export default {
  data() {
    return {
      searchQuery: '',
      selectedMembre: {},
      filteredMembres: [],
      montantsDisponibles: [5, 10, 15, 20, 'Autre'],
      selectedMontant: null,
      customMontant: null,
      isCustomMontant: false,
      tourneePayee: false,
      selectedPaiement: null,
      moyensPaiement: ['Lydia', 'Espèces', 'Paylib'],
      montantTournée: null,
      showDropdown: false,
      showAddMembreModal: false,
      newMembreName: '',
      membres: [],
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
    searchQuery() {
      this.filterMembres()
    },
  },
  methods: {
    resetForm() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    openAddMembreModal() {
      this.showAddMembreModal = true
    },
    async addNewPersonne(nom) {
      try {
        if (!nom) {
          alert('Veuillez entrer un nom pour le nouveau membre.')
          return
        }

        const docRef = doc(db, 'membres', nom)

        // Ajouter ou mettre à jour le document avec les données
        await setDoc(docRef, {
          name: nom,
          isResp: false,
          totalDette: 0,
          totalPaye: 0,
        })

        console.log('Nouveau membre ajouté avec ID:', docRef.id)

        // Ajouter le nouveau membre dans la liste et le sélectionner
        this.membres.push({ name: nom })
        this.selectedMembre = { name: nom }
        this.showAddMembreModal = false
        this.newMembreName = ''

        alert(`${nom} a été ajouté avec succès !`)
      } catch (error) {
        console.error("Erreur lors de l'ajout d'un nouveau membre :", error)
      }
    },
    handleClickOutside(event) {
      if (!this.$refs.container.contains(event.target)) {
        this.showDropdown = false
      }
    },
    selectMembre(membre) {
      this.selectedMembre = membre
      this.searchQuery = membre.name // Remplir l'input avec le nom du membre sélectionné
      this.showDropdown = false // Fermer la liste déroulante
    },
    filterMembres() {
      // Filtrer les membres en fonction de la requête de recherche
      this.filteredMembres = this.membres.filter(membre =>
        membre.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
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
        const date = new Date()

        // Gérer le totalDette de la personne
        const nouveauTotalDette = this.tourneePayee
          ? this.selectedMembre.totalDette || 0
          : (this.selectedMembre.totalDette || 0) + this.montantTournée

        // Gérer le totalPaye de la personne
        const nouveauTotalPaye = this.tourneePayee
          ? (this.selectedMembre.totalPaye || 0) + this.montantTournée
          : this.selectedMembre.totalPaye || 0

        // Ajout de la nouvelle tournée dans "tournees"
        const docRef = await addDoc(collection(db, 'tournees'), {
          name: this.selectedMembre.name,
          montant: this.montantTournée,
          paye: this.tourneePayee,
          dette: !this.tourneePayee,
          moyen: this.tourneePayee ? this.selectedPaiement : '',
          date: date,
          ...(this.tourneePayee === false
            ? { montantDette: this.montantTournée }
            : {}),
        })

        // Ajout transactions pour "membres"
        const membresRef = doc(
          db,
          'membres',
          this.selectedMembre.name,
          'transactions',
          docRef.id,
        )

        await setDoc(membresRef, {
          typeTransaction: 'tournée',
          montant: this.montantTournée,
          resteAPayer: this.tourneePayee ? 0 : this.montantTournée,
          moyenPaiement: this.tourneePayee ? this.selectedPaiement : '',
          date: date,
          statut: this.tourneePayee ? 'payée' : 'non payée',
          tourneeId: docRef.id,
        })

        if (this.tourneePayee == false) {
          await addDoc(collection(db, 'dettes'), {
            tourneeId: docRef.id,
            statut: 'non payée',
            montant: this.montantTournée,
            date: date,
            moyenPaiement: '',
            name: this.selectedMembre.name,
          })
        }

        const membreRef = doc(db, 'membres', this.selectedMembre.name)
        console.log(nouveauTotalPaye)
        console.log(nouveauTotalDette)
        await updateDoc(membreRef, {
          totalDette: nouveauTotalDette,
          totalPaye: nouveauTotalPaye,
        })

        console.log("Document ajouté avec l'ID : ", docRef.id)

        // Mise à jour des totaux
        const consosRef = collection(db, 'consommations')

        try {
          const consosSnap = await getDocs(consosRef)
          if (consosSnap.empty) {
            console.error(
              "Erreur : Aucun document trouvé dans la collection 'consommations'.",
            )
            return
          }

          const firstDoc = consosSnap.docs[0]
          const consosData = firstDoc.data()

          // Récupération des totaux actuels avec des valeurs par défaut
          const totalDetteConso = consosData?.totalDette ?? 0
          const totalPayeConso = consosData?.totalPaye ?? 0

          console.log('Valeur actuelle de totalDetteConso :', totalDetteConso)
          console.log('Valeur actuelle de totalPayeConso :', totalPayeConso)
          console.log('Montant de la tournée :', this.montantTournée)

          // Recharger les données actuelles pour une mise à jour synchronisée
          const ref = doc(db, 'consommations', firstDoc.id)
          const updatedDocSnap = await getDoc(ref)
          const updatedData = updatedDocSnap.data()
          const currentTotalPayeConso = updatedData?.totalPayeConso ?? 0
          const currentTotalDetteConso = updatedData?.totalDetteConso ?? 0

          await updateDoc(ref, {
            totalDetteConso: this.tourneePayee
              ? currentTotalDetteConso
              : currentTotalDetteConso + this.montantTournée,
            totalPayeConso: this.tourneePayee
              ? currentTotalPayeConso + this.montantTournée
              : currentTotalPayeConso,
          })

          console.log('Mise à jour des totaux réussie !')
        } catch (error) {
          console.error('Erreur lors de la mise à jour des totaux :', error)
        }

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
    this.fetchMembres(),
      document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    // Nettoyer l'écouteur d'événement lorsque le composant est détruit
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

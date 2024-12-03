<template>
  <div id="home" class="min-h-screen p-6 w-full flex flex-col items-center">
    <header
      class="flex items-center justify-center text-light p-4 rounded mb-6"
    >
      <button
        @click="goHome"
        class="flex items-center justify-center w-10 h-10 bg-midnight text-light rounded-full hover:bg-gray-700 transition duration-300"
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
      <img class="w-7/12" src="../assets/imgs/toucy.svg" alt="" />
    </header>

    <main class="bg-midnight w-3/4 p-6 rounded shadow-md">
      <!-- Liste des dettes par membre -->
      <div class="mb-4">
        <h1 class="text-xl text-light font-semibold text-center mb-8">
          Payez une Dette !
        </h1>
        <label class="block text-light font-medium mb-2" for="personne">
          👤 Choisissez une dette :
        </label>
        <select
          v-model="selectedPersonne"
          @change="updateMontantsDisponibles"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option v-for="dette in dettesList" :key="dette.id" :value="dette.id">
            {{ dette.name }} ({{ dette.montant }}€ de dette)
          </option>
        </select>
      </div>

      <!-- Sélection du montant -->
      <div class="mb-4">
        <label class="block text-light font-medium mb-2">
          💰 Choisissez un montant :
        </label>
        <select
          v-model="montantTournée"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option
            v-for="montant in montantsDisponibles"
            :key="montant"
            :value="montant"
          >
            {{ montant }} €
          </option>
        </select>
      </div>

      <!-- Sélection du moyen de paiement -->
      <div class="mt-4">
        <label class="block text-light font-medium mb-2">
          💳 Choisissez un moyen de paiement :
        </label>
        <select
          v-model="moyenPaiement"
          class="w-full border border-sky-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option v-for="moyen in moyensPaiement" :key="moyen" :value="moyen">
            {{ moyen }}
          </option>
        </select>
      </div>

      <!-- Bouton de validation -->
      <button
        @click="saveTournee"
        class="w-full mt-6 bg-accent text-light py-3 rounded hover:bg-accent transition duration-200"
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
  updateDoc,
  doc,
  getDoc,
  addDoc,
} from 'firebase/firestore'

export default {
  name: 'formDetteView',
  data() {
    return {
      selectedPersonne: null,
      tournees: [],
      montantsDisponibles: [5, 10, 15, 20],
      montantTournée: null,
      nomPersonne: '',
      moyenPaiement: null,
      moyensPaiement: ['Lydia', 'Espèces', 'Paylib'],
      dettesList: [],
    }
  },

  methods: {
    resetForm() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    async fetchTournees() {
      try {
        //const dettes = query(
        //collection(db, 'dettes'),
        // where('montant', '>', '0'),
        //)
        const dettesCollection = await getDocs(collection(db, 'dettes'))
        const dettesArray = []
        dettesCollection.forEach(doc => {
          if (doc.data().montant > 0) {
            dettesArray.push({ id: doc.id, ...doc.data() })
          }
        })
        this.dettesList = dettesArray
      } catch (error) {
        console.error('Erreur lors de la récupération des tournées :', error)
      }
    },
    updateMontantsDisponibles() {
      const selectedDette = this.dettesList.find(
        dette => dette.id === this.selectedPersonne,
      )
      if (selectedDette) {
        const possibleMontants = [5, 10, 15, 20, 30, 40, 50, 60]
        const montantRestant = parseFloat(selectedDette.montant)

        this.montantsDisponibles = possibleMontants.filter(
          montant => montant <= montantRestant,
        )

        this.nomPersonne = selectedDette.name
      }
    },

    handleMontantSelection(montant) {
      this.montantTournée = montant
      console.log('Montant sélectionné :', montant)
    },
    async saveTournee() {
      // Vérifie que tous les champs obligatoires sont remplis
      if (
        !this.selectedPersonne ||
        !this.montantTournée ||
        !this.moyenPaiement
      ) {
        alert(
          'Veuillez sélectionner une personne, un montant et un moyen de paiement.',
        )
        return
      }

      try {
        // Vérifie si la liste des dettes est définie
        if (!this.dettesList || !Array.isArray(this.dettesList)) {
          console.error(
            "Erreur : 'dettesList' est undefined ou n'est pas un tableau.",
          )
          alert(
            "Une erreur est survenue : la liste des dettes n'est pas disponible.",
          )
          return
        }

        // Recherche la dette correspondant à la personne sélectionnée
        const selectedMontant = this.dettesList.find(
          dette => dette.id === this.selectedPersonne,
        )

        if (!selectedMontant) {
          console.error(
            'Erreur : Aucune dette trouvée pour la personne sélectionnée.',
          )
          alert('Aucune dette trouvée pour la personne sélectionnée.')
          return
        }

        // Récupère le montant actuel de la dette
        const montantDette = selectedMontant.montant
        console.log('Montant actuel de la dette:', montantDette)

        // Calcule la nouvelle dette après le paiement
        const nouvelleDette = montantDette - this.montantTournée
        const isDetteCompletelyPaid = nouvelleDette <= 0

        // Mise à jour de la dette dans Firestore
        const docRef = doc(db, 'dettes', this.selectedPersonne)
        await updateDoc(docRef, {
          montant: isDetteCompletelyPaid ? 0 : nouvelleDette,
          statut: isDetteCompletelyPaid ? 'payé' : 'non payée',
          moyenPaiement: this.moyenPaiement,
        })
        console.log('Dette mise à jour avec succès dans "dettes".')

        // Récupération des données de la dette
        const detteSnap = await getDoc(docRef)
        if (!detteSnap.exists()) {
          alert("La dette sélectionnée n'existe pas dans la base de données.")
          return
        }
        const detteData = detteSnap.data()
        const nameTransac = detteData.name
        console.log('Name récupérées:', nameTransac)
        console.log('Données transac :', detteSnap)

        // Mise à jour de la transaction
        const membreRef = doc(db, 'membres', nameTransac)
        const membreSnap = await getDoc(membreRef)
        if (!membreSnap.exists()) {
          alert(
            "La dette membre sélectionnée n'existe pas dans la base de données.",
          )
          return
        }
        const membreData = membreSnap.data()
        const totalDette = membreData.totalDette
        const totalPaye = membreData.totalPaye
        const newTotalDette = totalDette - this.montantTournée
        const newTotalPaye = totalPaye + this.montantTournée

        const tourneeId = detteData.tourneeId
        const transacRef = doc(membreRef, 'transactions', tourneeId)

        // Si le reste à payer est égale au montant que la personne a payé (dette payé)
        if (nouvelleDette == 0) {
          await updateDoc(transacRef, {
            statut: 'payée',
            moyenPaiement: this.moyenPaiement,
            resteAPayer: 0,
          })
          console.log('Transaction mise à jour, dette remboursée')
        } else {
          await updateDoc(transacRef, {
            resteAPayer: nouvelleDette,
            moyenPaiement: this.moyenPaiement,
          })
          console.log(
            'Transaction mise à jour, nouvelle dette :',
            nouvelleDette,
          )
        }
        console.log('Transaction mise à jour.')

        // Mise à jour du total des dettes pour le membre

        console.log('totalDette:', totalDette)
        await updateDoc(membreRef, {
          totalDette: newTotalDette,
          totalPaye: newTotalPaye,
        })
        console.log('Totaux mis à jour !')

        // Mise à jour des totaux généraux
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

          const ref = doc(db, 'consommations', firstDoc.id)
          const updatedDocSnap = await getDoc(ref)
          const updatedData = updatedDocSnap.data()

          const currentTotalPayeConso = updatedData?.totalPayeConso ?? 0
          const currentTotalDetteConso = updatedData?.totalDetteConso ?? 0

          console.log('totalDetteConso :', currentTotalDetteConso)
          console.log('totalPayeConso :', currentTotalPayeConso)

          const newTotalDette = currentTotalDetteConso - this.montantTournée
          const newTotalPaye = currentTotalPayeConso + this.montantTournée

          await updateDoc(ref, {
            totalDetteConso: newTotalDette,
            totalPayeConso: newTotalPaye,
          })
        } catch (error) {
          console.error('Erreur lors de la mise à jour des totaux :', error)
        }
        const date = new Date()

        await addDoc(collection(db, 'tournees'), {
          name: nameTransac,
          montant: this.montantTournée,
          paye: true,
          dette: false,
          moyen: this.moyenPaiement,
          date: date,
        })

        // Rafraîchissement des tournées
        await this.fetchTournees()

        alert('La dette a été modifiée avec succès !')
        this.resetForm()
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la dette :', error)
        alert('Une erreur est survenue lors de la mise à jour de la dette.')
      }
    },
    goHome() {
      this.$router.push('/')
    },
  },
  mounted() {
    this.fetchTournees()
  },
}
</script>

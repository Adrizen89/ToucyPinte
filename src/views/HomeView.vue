<template>
  <div id="homeForm" class="bg-sky-950 h-screen overflow-auto px-4 font-sans">
    <main class="flex flex-col justify-evenly items-start h-full">
      <img src="../assets/imgs/toucy.svg" alt="" />
      <div class="flex justify-center items-center w-full px-6 gap-10">
        <!-- Nombre aligné à gauche (Montant récolté) -->
        <p class="text-3xl font-bold text-sky-50">
          {{ totalCollected - totalDet }} € <br />récoltés
        </p>

        <!-- consos restantes -->
        <div class="flex flex-col items-center">
          <!-- Affichage du nombre de consos restantes ou input pour la modification -->
          <p
            v-if="!isEditing"
            class="text-2xl font-bold text-sky-50 cursor-pointer"
            @click="startEditing"
          >
            {{ nombreConsos || '0' }} <br />consos restantes
          </p>
          <input
            v-else
            type="number"
            v-model="nombreConsos"
            class="text-2xl font-bold text-sky-800 bg-white rounded-lg p-2 text-center w-20"
            @blur="saveConsos"
            @keydown.enter="saveConsos"
          />

          <!-- Boutons pour ajouter/enlever une conso -->
          <div class="flex mt-2 gap-10 justify-start w-full">
            <button
              @click="decrementConsos"
              class="px-3 py-1 bg-sky-400 text-white rounded-lg hover:bg-sky-600"
            >
              -
            </button>
            <button
              @click="incrementConsos"
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
import { db } from '@/firebase/index'
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      collectedAmount: 123,
      remainingConsos: 12,
      nombreConsos: '',
      inputConsos: 12,
      isEditing: false,
      tournees: [],
    }
  },
  methods: {
    async fetchTotal() {
      try {
        const totalCollection = collection(db, 'tournees')
        const totauxSnapshot = await getDocs(totalCollection)
        this.tournees = totauxSnapshot.docs.map(doc => doc.data()) // Stocker les tournées récupérées
      } catch (error) {
        console.error('Erreur lors de la récupération des tournées:', error)
      }
    },
    async fetchConsos() {
      try {
        const consommationsCol = collection(db, 'consommations')
        const consommationsSnap = await getDocs(consommationsCol)

        if (!consommationsSnap.empty) {
          const consommation = consommationsSnap.docs[0].data().nombre
          this.nombreConsos = consommation
        } else {
          this.nombreConsos = 0
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des consommations :',
          error,
        )
      }
    },
    async incrementConsos() {
      this.nombreConsos++
      await this.updateConsos(this.nombreConsos)
    },
    async decrementConsos() {
      if (this.nombreConsos > 0) {
        this.nombreConsos--
        await this.updateConsos(this.nombreConsos)
      }
    },
    async updateConsos(newValue) {
      try {
        const consommationsCollection = collection(db, 'consommations')
        const consommationsSnapshot = await getDocs(consommationsCollection)

        if (!consommationsSnapshot.empty) {
          const consommationDoc = consommationsSnapshot.docs[0]
          const consommationRef = doc(db, 'consommations', consommationDoc.id)
          await updateDoc(consommationRef, {
            nombre: newValue,
          })
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour des consos:', error)
      }
    },
    async saveConsos() {
      // Si la valeur entrée n'est pas valide, on ne fait rien
      if (!this.nombreConsos || this.nombreConsos <= 0) {
        alert('Veuillez entrer un nombre valide.')
        return
      }

      try {
        // Rechercher la première entrée dans la collection "consommations"
        const consommationsCollection = collection(db, 'consommations')
        const consommationsSnapshot = await getDocs(consommationsCollection)

        if (!consommationsSnapshot.empty) {
          // Si un enregistrement existe, le mettre à jour
          const consommationDoc = consommationsSnapshot.docs[0] // Prendre le premier enregistrement trouvé
          const consommationRef = doc(db, 'consommations', consommationDoc.id)
          await updateDoc(consommationRef, {
            nombre: this.nombreConsos, // Mise à jour du nombre
          })
          alert('Nombre de consos mis à jour avec succès !')
        } else {
          // Si aucun enregistrement trouvé, en créer un nouveau
          const docRef = await addDoc(collection(db, 'consommations'), {
            nombre: this.nombreConsos,
            date: new Date().toLocaleDateString('fr-FR'),
          })
          console.log("Nouvelle consommation enregistrée avec l'ID:", docRef.id)
          alert('Nouvelle consommation enregistrée avec succès !')
        }

        // Sortir du mode d'édition et revenir à l'état initial
        this.isEditing = false
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des consos :", error)
      }
    },
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
  computed: {
    totalCollected() {
      if (!this.tournees || !this.tournees.length) return '0.00'
      return this.tournees
        .reduce((sum, tournee) => {
          const montant = parseFloat(tournee.montant)
          return sum + (isNaN(montant) ? 0 : montant)
        }, 0)
        .toFixed(2)
    },
    // Calculer le montant total des dettes
    totalDet() {
      if (!this.tournees || !this.tournees.length) return '0.00'
      return this.tournees
        .filter(tournee => tournee.dette === true)
        .reduce((sum, tournee) => {
          const montant = parseFloat(tournee.montantDette)
          return sum + (isNaN(montant) ? 0 : montant)
        }, 0)
        .toFixed(2)
    },
  },
  mounted() {
    this.fetchConsos(), this.fetchTotal()
  },
  name: 'HomeView',
}
</script>

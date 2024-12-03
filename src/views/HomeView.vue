<template>
  <div id="homeForm" class="bg-sky-950 h-screen overflow-auto px-4 font-sans">
    <main class="flex flex-col justify-evenly items-center h-full">
      <img class="" src="../assets/imgs/toucy.svg" alt="" />
      <div class="flex justify-center items-center w-full px-6 gap-10">
        <!-- Nombre aligné à gauche (Montant récolté) -->
        <p class="text-3xl font-bold text-light">
          {{ totalPayeConso }} € <br />récoltés
        </p>

        <!-- consos restantes -->
        <div class="flex flex-col items-center">
          <!-- Affichage du nombre de consos restantes ou input pour la modification -->
          <p
            v-if="!isEditing"
            class="text-2xl font-bold text-light cursor-pointer"
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
              class="px-3 py-1 bg-midnight text-light rounded-lg hover:bg-lightnight"
            >
              -
            </button>
            <button
              @click="incrementConsos"
              class="px-3 py-1 bg-midnight text-light rounded-lg hover:bg-lightnight"
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
          class="flex flex-col items-center p-6 bg-midnight rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToFormAddView"
        >
          <!-- Cercle autour de l'icône -->
          <div
            class="flex items-center justify-center w-16 h-16 bg-firstCard rounded-full mb-3"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-8 w-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M8 12H16M12 8V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#9f1239"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </div>
          <!-- Texte sous l'icône -->
          <span class="text-lg text-center font-semibold text-light"
            >Ajouter une tournée</span
          >
        </div>

        <!-- Card 2: Payer une dette -->
        <div
          class="flex flex-col items-center p-6 bg-midnight rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToFormDetteView"
        >
          <!-- Cercle autour de l'icône, parfaitement centré -->
          <div
            class="flex items-center justify-center w-16 h-16 bg-secondCard rounded-full mb-3"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-8 w-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M13 19.0008L17.8 19C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.0799 3 8.2V15M3 9H20M9 19.0008L3 19M9 19.0008L7 17M9 19.0008L7 21"
                  stroke="#3f6212"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </div>
          <!-- Texte sous l'icône -->
          <span class="text-lg text-center font-semibold text-light"
            >Payer une dette</span
          >
        </div>

        <!-- Card 3: Voir le tableau de bord -->
        <div
          class="flex flex-col items-center p-6 bg-midnight rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="goToDashboardView"
        >
          <div
            class="flex items-center justify-center w-16 h-16 bg-thirdCard rounded-full mb-3"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-8 w-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M19.9497 17.9497L15 13H22C22 14.933 21.2165 16.683 19.9497 17.9497Z"
                  stroke="#3730a3"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M20 10C20 6.13401 16.866 3 13 3V10H20Z"
                  stroke="#3730a3"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M2 12C2 16.4183 5.58172 20 10 20C12.2091 20 14.2091 19.1046 15.6569 17.6569L10 12V4C5.58172 4 2 7.58172 2 12Z"
                  stroke="#3730a3"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </div>
          <span class="text-lg text-center font-semibold text-light"
            >Voir le tableau de bord</span
          >
        </div>

        <!-- Card 4: Prochainement -->
        <div
          class="flex flex-col items-center p-6 bg-midnight rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
          <div
            class="flex items-center justify-center w-16 h-16 bg-fourthCard rounded-full mb-3"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-8 w-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
                  stroke="#166534"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </div>
          <span class="text-lg text-center font-semibold text-light"
            >Prochainement</span
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
      totalPayeConso: 0,
      totalDetteConso: 0,
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
        const consosRef = collection(db, 'consommations')
        const consosSnap = await getDocs(consosRef)
        if (consosSnap.empty) {
          console.error(
            "Erreur : Aucun document trouvé dans la collection 'consommations'.",
          )
          return
        }

        const firstDoc = consosSnap.docs[0]
        const consosData = firstDoc.data()

        // Mise à jour de la propriété réactive
        this.totalPayeConso = consosData?.totalPayeConso ?? 0
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

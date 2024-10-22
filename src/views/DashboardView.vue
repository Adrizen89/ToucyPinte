<template>
  <div class="container mx-auto p-6 bg-sky-950">
    <!-- Header avec le titre de l'application et flèche de retour -->
    <header class="flex items-center justify-start gap-10 mb-6">
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
      <h1 class="text-2xl font-bold text-sky-50 text-center">ToucyPinte</h1>
    </header>

    <!-- Table: Liste des Membres -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-sky-50 mb-4">Liste des Membres</h2>
      <!-- Vérification si les membres existent avant d'afficher la table -->
      <table
        v-if="members && members.length > 0"
        class="min-w-full bg-sky-50 border rounded-lg shadow-md"
      >
        <thead>
          <tr>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('name', 'members')"
            >
              Nom
              <span v-if="sortKeyMembers === 'name'">{{
                sortDirectionMembers === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('totalPaid', 'members')"
            >
              Total Payé
              <span v-if="sortKeyMembers === 'totalPaid'">{{
                sortDirectionMembers === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('totalDebt', 'members')"
            >
              Total Dette
              <span v-if="sortKeyMembers === 'totalDebt'">{{
                sortDirectionMembers === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(member, index) in paginatedMembers"
            :key="index"
            class="hover:bg-gray-100"
          >
            <td class="px-4 py-2 border-b text-sky-900">{{ member.name }}</td>
            <td class="px-4 py-2 border-b text-sky-800">
              {{ member.totalPaid }}€
            </td>
            <td class="px-4 py-2 border-b text-sky-800">
              {{ member.totalDebt }}€
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Message à afficher si aucun membre n'est trouvé -->
      <p v-else class="text-white">Aucun membre trouvé pour l'instant.</p>
    </div>

    <!-- Pagination pour les membres -->
    <div
      v-if="members && members.length > rowLimit"
      class="flex justify-between items-center mt-4"
    >
      <button
        @click="prevPage('members')"
        :disabled="currentPageMembers === 1"
        class="btn-pagination"
      >
        Précédent
      </button>
      <span class="text-gray-600"
        >Page {{ currentPageMembers }} sur {{ totalPagesMembers }}</span
      >
      <button
        @click="nextPage('members')"
        :disabled="currentPageMembers === totalPagesMembers"
        class="btn-pagination"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/index'
import { collection, getDocs } from 'firebase/firestore'

export default {
  data() {
    return {
      members: [], // Initialisation de la liste des membres comme tableau vide
      sortKeyMembers: '',
      sortDirectionMembers: 'asc',
    }
  },
  computed: {
    paginatedMembers() {
      const sortedData = this.sortData(this.members, 'members')
      return sortedData
    },
  },
  methods: {
    async fetchMembers() {
      try {
        const membersCollection = collection(db, 'members') // Assure-toi que le nom de la collection est correct
        const membersSnapshot = await getDocs(membersCollection)
        this.members = membersSnapshot.docs.map(doc => doc.data()) // Convertit les données récupérées
      } catch (error) {
        console.error('Erreur lors de la récupération des membres:', error)
      }
    },
    sortBy(key, table) {
      if (table === 'members') {
        if (this.sortKeyMembers === key) {
          this.sortDirectionMembers =
            this.sortDirectionMembers === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortKeyMembers = key
          this.sortDirectionMembers = 'asc'
        }
      }
    },
    sortData(data) {
      if (!this.sortKeyMembers) return data
      return data.slice().sort((a, b) => {
        if (this.sortDirectionMembers === 'asc') {
          return a[this.sortKeyMembers] > b[this.sortKeyMembers] ? 1 : -1
        } else {
          return a[this.sortKeyMembers] < b[this.sortKeyMembers] ? 1 : -1
        }
      })
    },
    goHome() {
      this.$router.push('/')
    },
  },
  mounted() {
    this.fetchMembers() // Récupérer les membres dès que le composant est monté
  },
}
</script>

<style scoped>
.btn-pagination {
  background-color: #075985;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}
.btn-pagination:hover {
  background-color: #2d3748;
}
.btn-pagination:disabled {
  background-color: #0369a1;
  cursor: not-allowed;
}
</style>

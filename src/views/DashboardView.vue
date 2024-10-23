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

    <!-- Table: Liste des Transactions -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-sky-50 mb-4">
        Liste des Transactions
      </h2>

      <table
        v-if="paginatedTransactions && paginatedTransactions.length > 0"
        class="min-w-full bg-sky-50 border rounded-lg shadow-md"
      >
        <thead>
          <tr>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('name', 'transactions')"
            >
              Toucycois
              <span v-if="sortKeyTransactions === 'name'">{{
                sortDirectionTransactions === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('montant', 'transactions')"
            >
              Montant
              <span v-if="sortKeyTransactions === 'montant'">{{
                sortDirectionTransactions === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('date', 'transactions')"
            >
              Date
              <span v-if="sortKeyTransactions === 'date'">{{
                sortDirectionTransactions === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(tournee, index) in paginatedTransactions"
            :key="index"
            class="hover:bg-gray-100"
          >
            <td class="px-4 py-2 border-b text-sky-900">{{ tournee.name }}</td>
            <td class="px-4 py-2 border-b text-sky-800">
              {{ tournee.montant }}€
            </td>
            <td class="px-4 py-2 border-b text-sky-800">{{ tournee.date }}</td>
          </tr>
          <tr
            v-for="n in emptyRows('paginatedTransactions')"
            :key="'empty-transactions-' + n"
          >
            <td class="px-4 py-2 border-b text-sky-900">&nbsp;</td>
            <td class="px-4 py-2 border-b text-sky-800">&nbsp;</td>
            <td class="px-4 py-2 border-b text-sky-800">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-white">
        Aucune transaction trouvée pour l'instant.
      </p>

      <div
        class="flex justify-between items-center mt-4"
        v-if="totalPagesTransactions > 1"
      >
        <button
          class="btn-pagination"
          :disabled="currentPageTransactions === 1"
          @click="prevPage('transactions')"
        >
          Précédent
        </button>
        <span class="text-gray-600"
          >Page {{ currentPageTransactions }} sur
          {{ totalPagesTransactions }}</span
        >
        <button
          class="btn-pagination"
          :disabled="currentPageTransactions === totalPagesTransactions"
          @click="nextPage('transactions')"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Table: Liste des Membres avec leurs totaux -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-sky-50 mb-4">
        Liste des Toucycois
      </h2>

      <table
        v-if="paginatedMembres && paginatedMembres.length > 0"
        class="min-w-full bg-sky-50 border rounded-lg shadow-md"
      >
        <thead>
          <tr>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('name', 'membres')"
            >
              Toucycois
              <span v-if="sortKeyMembres === 'name'">{{
                sortDirectionMembres === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('totalPaid', 'membres')"
            >
              Total payé
              <span v-if="sortKeyMembres === 'totalPaid'">{{
                sortDirectionMembres === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('totalDebt', 'membres')"
            >
              Total Dette
              <span v-if="sortKeyMembres === 'totalDebt'">{{
                sortDirectionMembres === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(member, index) in paginatedMembres"
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
          <tr
            v-for="n in emptyRows('paginatedMembres')"
            :key="'empty-membres-' + n"
          >
            <td class="px-4 py-2 border-b text-sky-900">&nbsp;</td>
            <td class="px-4 py-2 border-b text-sky-800">&nbsp;</td>
            <td class="px-4 py-2 border-b text-sky-800">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-white">
        Aucune transaction trouvée pour l'instant.
      </p>

      <div
        class="flex justify-between items-center mt-4"
        v-if="totalPagesMembres > 1"
      >
        <button
          class="btn-pagination"
          :disabled="currentPageMembres === 1"
          @click="prevPage('membres')"
        >
          Précédent
        </button>
        <span class="text-gray-600"
          >Page {{ currentPageMembres }} sur {{ totalPagesMembres }}</span
        >
        <button
          class="btn-pagination"
          :disabled="currentPageMembres === totalPagesMembres"
          @click="nextPage('membres')"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Table: Liste des Dettes -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-sky-50 mb-4">Liste des Dettes</h2>

      <table
        v-if="paginatedDebts && paginatedDebts.length > 0"
        class="min-w-full bg-sky-50 border rounded-lg shadow-md"
      >
        <thead>
          <tr>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('name', 'debts')"
            >
              Toucycois
              <span v-if="sortKeyDebts === 'name'">{{
                sortDirectionDebts === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('montantDette', 'debts')"
            >
              Montant Dette
              <span v-if="sortKeyDebts === 'montantDette'">{{
                sortDirectionDebts === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('date', 'debts')"
            >
              Date
              <span v-if="sortKeyDebts === 'date'">{{
                sortDirectionDebts === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(debt, index) in paginatedDebts"
            :key="index"
            class="hover:bg-gray-100"
          >
            <td class="px-4 py-2 border-b text-sky-900">{{ debt.name }}</td>
            <td class="px-4 py-2 border-b text-sky-800">
              {{ debt.montantDette }}€
            </td>
            <td class="px-4 py-2 border-b text-sky-800">{{ debt.date }}</td>
          </tr>
          <!-- Ajouter des lignes vides si nécessaire -->
          <tr
            v-for="n in emptyRows('paginatedDebts')"
            :key="'empty-dettes-' + n"
          >
            <td class="px-4 py-2 border-b text-sky-900">&nbsp;</td>
            <td class="px-4 py-2 border-b text-sky-800">&nbsp;</td>
            <td class="px-4 py-2 border-b text-sky-800">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-white">Aucune dette trouvée pour l'instant.</p>

      <div
        class="flex justify-between items-center mt-4"
        v-if="totalPagesDebts > 1"
      >
        <button
          class="btn-pagination"
          :disabled="currentPageDebts === 1"
          @click="prevPage('debts')"
        >
          Précédent
        </button>
        <span class="text-gray-600"
          >Page {{ currentPageDebts }} sur {{ totalPagesDebts }}</span
        >
        <button
          class="btn-pagination"
          :disabled="currentPageDebts === totalPagesDebts"
          @click="nextPage('debts')"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/index'
import { collection, getDocs } from 'firebase/firestore'

export default {
  data() {
    return {
      transactions: [],
      sortKeyTransactions: '',
      sortDirectionTransactions: 'asc',
      sortKeyMembres: '',
      sortDirectionMembres: 'asc',
      sortKeyDebts: '',
      sortDirectionDebts: 'asc',
      currentPageTransactions: 1,
      currentPageDebts: 1,
      currentPageMembres: 1,
      itemsPerPage: 5,
    }
  },
  computed: {
    emptyRows() {
      return table => {
        const paginatedData = this[table]
        return this.itemsPerPage - paginatedData.length
      }
    },
    filteredMembers() {
      const membersTotals = {}

      // Calculer le total payé et total dette pour chaque membre
      for (const tournee of this.transactions) {
        if (!membersTotals[tournee.name]) {
          membersTotals[tournee.name] = {
            name: tournee.name,
            totalPaid: 0,
            totalDebt: 0,
          }
        }

        // Si c'est payé, on ajoute au total payé
        if (tournee.paye) {
          membersTotals[tournee.name].totalPaid += parseFloat(tournee.montant)
        }

        // Si c'est une dette, on ajoute au total des dettes
        if (tournee.dette) {
          membersTotals[tournee.name].totalDebt += parseFloat(
            tournee.montantDette,
          )
        }
      }

      // Retourner les membres avec leur total payé et dette
      return Object.values(membersTotals)
    },
    paginatedMembres() {
      const sortedMembres = this.sortedMembres
      const start = (this.currentPageMembres - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return sortedMembres.slice(start, end)
    },
    paginatedTransactions() {
      const sortedTransactions = this.sortedTransactions
      const start = (this.currentPageTransactions - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return sortedTransactions.slice(start, end)
    },
    paginatedDebts() {
      const sortedDebts = this.sortedDebts
      const start = (this.currentPageDebts - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return sortedDebts.slice(start, end)
    },
    totalPagesTransactions() {
      return Math.ceil(this.transactions.length / this.itemsPerPage)
    },
    totalPagesMembres() {
      return Math.ceil(this.filteredMembers.length / this.itemsPerPage)
    },
    totalPagesDebts() {
      return Math.ceil(this.filteredDebts.length / this.itemsPerPage)
    },
    filteredDebts() {
      return this.transactions.filter(tournee => tournee.montantDette > 0)
    },
    sortedTransactions() {
      return [...this.transactions].sort((a, b) => {
        let modifier = this.sortDirectionTransactions === 'asc' ? 1 : -1
        if (a[this.sortKeyTransactions] < b[this.sortKeyTransactions])
          return -1 * modifier
        if (a[this.sortKeyTransactions] > b[this.sortKeyTransactions])
          return 1 * modifier
        return 0
      })
    },
    sortedMembres() {
      return [...this.filteredMembers].sort((a, b) => {
        let modifier = this.sortDirectionMembres === 'asc' ? 1 : -1
        if (a[this.sortKeyMembres] < b[this.sortKeyMembres])
          return -1 * modifier
        if (a[this.sortKeyMembres] > b[this.sortKeyMembres]) return 1 * modifier
        return 0
      })
    },
    sortedDebts() {
      return [...this.filteredDebts].sort((a, b) => {
        let modifier = this.sortDirectionDebts === 'asc' ? 1 : -1
        if (a[this.sortKeyDebts] < b[this.sortKeyDebts]) return -1 * modifier
        if (a[this.sortKeyDebts] > b[this.sortKeyDebts]) return 1 * modifier
        return 0
      })
    },
  },
  methods: {
    async fetchTransac() {
      try {
        const tourneesCollection = collection(db, 'tournees')
        const tourneesSnapshot = await getDocs(tourneesCollection)
        this.transactions = tourneesSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error)
      }
    },
    sortBy(key, type) {
      if (type === 'transactions') {
        if (this.sortKeyTransactions === key) {
          this.sortDirectionTransactions =
            this.sortDirectionTransactions === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortKeyTransactions = key
          this.sortDirectionTransactions = 'asc'
        }
      } else if (type === 'membres') {
        if (this.sortKeyMembres === key) {
          this.sortDirectionMembres =
            this.sortDirectionMembres === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortKeyMembres = key
          this.sortDirectionMembres = 'asc'
        }
      } else if (type === 'debts') {
        if (this.sortKeyDebts === key) {
          this.sortDirectionDebts =
            this.sortDirectionDebts === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortKeyDebts = key
          this.sortDirectionDebts = 'asc'
        }
      }
    },
    nextPage(table) {
      if (
        table === 'transactions' &&
        this.currentPageTransactions < this.totalPagesTransactions
      ) {
        this.currentPageTransactions++
      } else if (
        table === 'membres' &&
        this.currentPageMembres < this.totalPagesMembres
      ) {
        this.currentPageMembres++
      } else if (
        table === 'debts' &&
        this.currentPageDebts < this.totalPagesDebts
      ) {
        this.currentPageDebts++
      }
    },
    prevPage(table) {
      if (table === 'transactions' && this.currentPageTransactions > 1) {
        this.currentPageTransactions--
      } else if (table === 'membres' && this.currentPageMembres > 1) {
        this.currentPageMembres--
      } else if (table === 'debts' && this.currentPageDebts > 1) {
        this.currentPageDebts--
      }
    },
    goHome() {
      this.$router.push('/')
    },
  },
  mounted() {
    this.fetchTransac()
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
  background-color: #3b82f6;
}
.btn-pagination:disabled {
  background-color: #075985;
  cursor: not-allowed;
}
</style>

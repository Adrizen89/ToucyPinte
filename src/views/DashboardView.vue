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
      <table class="min-w-full bg-sky-50 border rounded-lg shadow-md">
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
      <div
        v-if="members.length > rowLimit"
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

    <!-- Table: Liste des Dettes -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold text-sky-50 mb-4">Liste des Dettes</h2>
      <table class="min-w-full bg-sky-50 border rounded-lg shadow-md">
        <thead>
          <tr>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('name', 'debts')"
            >
              Nom
              <span v-if="sortKeyDebts === 'name'">{{
                sortDirectionDebts === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-gray-600 border-b cursor-pointer"
              @click="sortBy('amount', 'debts')"
            >
              Montant Dette
              <span v-if="sortKeyDebts === 'amount'">{{
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
            <td class="px-4 py-2 border-b text-sky-800">{{ debt.amount }}€</td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="debts.length > rowLimit"
        class="flex justify-between items-center mt-4"
      >
        <button
          @click="prevPage('debts')"
          :disabled="currentPageDebts === 1"
          class="btn-pagination"
        >
          Précédent
        </button>
        <span class="text-gray-600"
          >Page {{ currentPageDebts }} sur {{ totalPagesDebts }}</span
        >
        <button
          @click="nextPage('debts')"
          :disabled="currentPageDebts === totalPagesDebts"
          class="btn-pagination"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Table: Liste des Transactions -->
    <div>
      <h2 class="text-lg font-semibold text-sky-50 mb-4">
        Liste des Transactions
      </h2>
      <table class="min-w-full bg-sky-50 border rounded-lg shadow-md">
        <thead>
          <tr>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('name', 'transactions')"
            >
              Nom
              <span v-if="sortKeyTransactions === 'name'">{{
                sortDirectionTransactions === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th
              class="px-4 py-2 text-left text-sky-950 border-b cursor-pointer"
              @click="sortBy('amount', 'transactions')"
            >
              Montant
              <span v-if="sortKeyTransactions === 'amount'">{{
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
            v-for="(transaction, index) in paginatedTransactions"
            :key="index"
            class="hover:bg-gray-100"
          >
            <td class="px-4 py-2 border-b text-sky-900">
              {{ transaction.name }}
            </td>
            <td class="px-4 py-2 border-b text-sky-800">
              {{ transaction.amount }}€
            </td>
            <td class="px-4 py-2 border-b text-sky-900">
              {{ transaction.date }}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="transactions.length > rowLimit"
        class="flex justify-between items-center mt-4"
      >
        <button
          @click="prevPage('transactions')"
          :disabled="currentPageTransactions === 1"
          class="btn-pagination"
        >
          Précédent
        </button>
        <span class="text-gray-600"
          >Page {{ currentPageTransactions }} sur
          {{ totalPagesTransactions }}</span
        >
        <button
          @click="nextPage('transactions')"
          :disabled="currentPageTransactions === totalPagesTransactions"
          class="btn-pagination"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rowLimit: 5,
      currentPageMembers: 1,
      currentPageDebts: 1,
      currentPageTransactions: 1,
      // Sort data for each table separately
      sortKeyMembers: '',
      sortDirectionMembers: 'asc',
      sortKeyDebts: '',
      sortDirectionDebts: 'asc',
      sortKeyTransactions: '',
      sortDirectionTransactions: 'asc',
      members: [
        { name: 'Adrien', totalPaid: 50, totalDebt: 20 },
        { name: 'Marie', totalPaid: 100, totalDebt: 30 },
        { name: 'Julien', totalPaid: 20, totalDebt: 10 },
        { name: 'Lucas', totalPaid: 70, totalDebt: 15 },
        { name: 'Emma', totalPaid: 90, totalDebt: 25 },
        { name: 'Sophie', totalPaid: 30, totalDebt: 50 },
      ],
      debts: [
        { name: 'Adrien', amount: 20 },
        { name: 'Marie', amount: 30 },
        { name: 'Julien', amount: 10 },
        { name: 'Lucas', amount: 15 },
        { name: 'Emma', amount: 25 },
        { name: 'Sophie', amount: 50 },
      ],
      transactions: [
        { name: 'Adrien', amount: 50, date: '12/10/2023' },
        { name: 'Marie', amount: 30, date: '14/10/2023' },
        { name: 'Julien', amount: 20, date: '15/10/2023' },
        { name: 'Lucas', amount: 70, date: '16/10/2023' },
        { name: 'Emma', amount: 90, date: '17/10/2023' },
        { name: 'Sophie', amount: 30, date: '18/10/2023' },
      ],
    }
  },
  computed: {
    paginatedMembers() {
      const sortedData = this.sortData(this.members, 'members')
      const start = (this.currentPageMembers - 1) * this.rowLimit
      const end = start + this.rowLimit
      return sortedData.slice(start, end)
    },
    totalPagesMembers() {
      return Math.ceil(this.members.length / this.rowLimit)
    },
    paginatedDebts() {
      const sortedData = this.sortData(this.debts, 'debts')
      const start = (this.currentPageDebts - 1) * this.rowLimit
      const end = start + this.rowLimit
      return sortedData.slice(start, end)
    },
    totalPagesDebts() {
      return Math.ceil(this.debts.length / this.rowLimit)
    },
    paginatedTransactions() {
      const sortedData = this.sortData(this.transactions, 'transactions')
      const start = (this.currentPageTransactions - 1) * this.rowLimit
      const end = start + this.rowLimit
      return sortedData.slice(start, end)
    },
    totalPagesTransactions() {
      return Math.ceil(this.transactions.length / this.rowLimit)
    },
  },
  methods: {
    nextPage(table) {
      if (
        table === 'members' &&
        this.currentPageMembers < this.totalPagesMembers
      ) {
        this.currentPageMembers++
      } else if (
        table === 'debts' &&
        this.currentPageDebts < this.totalPagesDebts
      ) {
        this.currentPageDebts++
      } else if (
        table === 'transactions' &&
        this.currentPageTransactions < this.totalPagesTransactions
      ) {
        this.currentPageTransactions++
      }
    },
    prevPage(table) {
      if (table === 'members' && this.currentPageMembers > 1) {
        this.currentPageMembers--
      } else if (table === 'debts' && this.currentPageDebts > 1) {
        this.currentPageDebts--
      } else if (table === 'transactions' && this.currentPageTransactions > 1) {
        this.currentPageTransactions--
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
      } else if (table === 'debts') {
        if (this.sortKeyDebts === key) {
          this.sortDirectionDebts =
            this.sortDirectionDebts === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortKeyDebts = key
          this.sortDirectionDebts = 'asc'
        }
      } else if (table === 'transactions') {
        if (this.sortKeyTransactions === key) {
          this.sortDirectionTransactions =
            this.sortDirectionTransactions === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortKeyTransactions = key
          this.sortDirectionTransactions = 'asc'
        }
      }
    },
    sortData(data, table) {
      let sortKey = ''
      let sortDirection = 'asc'
      if (table === 'members') {
        sortKey = this.sortKeyMembers
        sortDirection = this.sortDirectionMembers
      } else if (table === 'debts') {
        sortKey = this.sortKeyDebts
        sortDirection = this.sortDirectionDebts
      } else if (table === 'transactions') {
        sortKey = this.sortKeyTransactions
        sortDirection = this.sortDirectionTransactions
      }

      if (!sortKey) return data
      return data.slice().sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[sortKey] > b[sortKey] ? 1 : -1
        } else {
          return a[sortKey] < b[sortKey] ? 1 : -1
        }
      })
    },
    goHome() {
      this.$router.push('/')
    },
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

<template>
  <div
    class="tab-view h-screen text-light flex flex-col m-auto items-center w-full"
  >
    <header
      class="flex items-center justify-center gap-0 text-white p-4 rounded mb-6"
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
    <!-- Onglets -->
    <div class="tabs flex gap-4 my-4">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="setActiveTab(tab.name)"
        :class="[
          'px-6 py-2 rounded-lg font-semibold transition-all',
          activeTab === tab.name
            ? 'bg-accent text-light shadow-lg'
            : 'bg-midnight hover:bg-lightnight',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="tab-content w-full max-w-4xl p-6 rounded-lg shadow-lg">
      <!-- Membres -->
      <div v-if="activeTab === 'membres'">
        <table
          class="table-auto w-full text-center border-collapse border border-midnight"
        >
          <thead>
            <tr class="bg-midnight">
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('name')"
              >
                <span v-if="sortColumn === 'name'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span
                >Nom
              </th>
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('totalPaye')"
              >
                <span v-if="sortColumn === 'totalPaye'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span
                >Total Payé
              </th>
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('totalDette')"
              >
                <span v-if="sortColumn === 'totalDette'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span
                >Total Dette
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="membre in membres"
              :key="membre.id"
              class="hover:bg-midnight"
            >
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ membre.name }}
              </td>
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ membre.totalPaye }} €
              </td>
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ membre.totalDette }} €
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="loading" class="text-center mt-4">Chargement des données...</p>
        <p v-if="!loading && membres.length === 0" class="text-center mt-4">
          Aucun membre trouvé.
        </p>
      </div>

      <!-- Transactions -->
      <div v-else-if="activeTab === 'transactions'">
        <table
          class="table-auto w-full text-center border-collapse border border-gray-700"
        >
          <thead>
            <tr class="bg-midnight">
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('name')"
              >
                <span v-if="sortColumn === 'name'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span>
                Nom
              </th>
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('montant')"
              >
                <span v-if="sortColumn === 'montant'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span
                >Montant
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="hover:bg-midnight"
            >
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ transaction.name }}
              </td>
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ transaction.montant }} €
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="loading" class="text-center mt-4">Chargement des données...</p>
        <p
          v-if="!loading && transactions.length === 0"
          class="text-center mt-4"
        >
          Aucune transaction trouvée.
        </p>
      </div>

      <!-- Dettes -->
      <div v-else-if="activeTab === 'dettes'">
        <table
          class="table-auto w-full text-center border-collapse border border-gray-700"
        >
          <thead>
            <tr class="bg-midnight">
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('name')"
              >
                <span v-if="sortColumn === 'name'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span>
                Nom
              </th>
              <th
                class="border border-lightnight px-4 py-2 text-sm"
                @click="sortTable('montant')"
              >
                <span v-if="sortColumn === 'montant'">{{
                  sortOrder === 'asc' ? '🔼' : '🔽'
                }}</span
                >Montant
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="dette in dettes.filter(
                dette => dette.statut === 'non payée',
              )"
              :key="dette.id"
              class="hover:bg-midnight"
            >
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ dette.name }}
              </td>
              <td class="border border-lightnight px-4 py-2 text-xs">
                {{ dette.montant }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="loading" class="text-center mt-4">Chargement des données...</p>
        <p v-if="!loading && dettes.length === 0" class="text-center mt-4">
          Aucune dette trouvée.
        </p>
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
      tabs: [
        { name: 'membres', label: 'Membres' },
        { name: 'transactions', label: 'Transactions' },
        { name: 'dettes', label: 'Dettes' },
      ],
      activeTab: 'membres',
      membres: [],
      transactions: [],
      dettes: [],
      loading: false,
      sortColumn: '',
      sortOrder: 'asc',
    }
  },
  methods: {
    async setActiveTab(tabName) {
      this.activeTab = tabName

      if (tabName === 'membres') {
        await this.fetchMembres()
      } else if (tabName === 'transactions') {
        await this.fetchTransac()
      } else if (tabName === 'dettes') {
        await this.fetchDettes()
      }
    },

    sortTable(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortOrder = 'asc'
      }

      this.dettes.sort((a, b) => {
        const valueA = a[column]
        const valueB = b[column]

        if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1
        if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })

      this.transactions.sort((a, b) => {
        const valueA = a[column]
        const valueB = b[column]

        if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1
        if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })

      this.membres.sort((a, b) => {
        const valueA = a[column]
        const valueB = b[column]

        if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1
        if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    },
    async fetchMembres() {
      this.loading = true
      try {
        const querySnapshot = await getDocs(collection(db, 'membres'))
        this.membres = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log(this.membres)
      } catch (error) {
        console.error('Erreur lors de la récupération des membres :', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTransac() {
      this.loading = true

      try {
        const transactionsSnapshot = await getDocs(collection(db, 'tournees'))
        this.transactions = transactionsSnapshot.docs.map(doc => ({
          ...doc.data(),
        }))
        console.log(this.transactions)
      } catch (error) {
        console.error(
          'Erreur lors de la récuparation des transactions :',
          error,
        )
      } finally {
        this.loading = false
      }
    },

    async fetchDettes() {
      this.loading = true
      try {
        const dettesSnapshot = await getDocs(collection(db, 'dettes'))
        this.dettes = dettesSnapshot.docs.map(doc => ({
          ...doc.data(),
        }))
        console.log(this.dettes)
      } catch (error) {
        console.error('Erreur lors de la récupération des dettes :', error)
      } finally {
        this.loading = false
      }
    },
    goHome() {
      this.$router.push('/')
    },
  },
  async mounted() {
    if (this.activeTab === 'membres') {
      await this.fetchMembres()
    } else if (this.activeTab === 'transactions') {
      await this.fetchTransac()
    } else if (this.activeTab === 'dettes') {
      await this.fetchDettes()
    }
  },
}
</script>

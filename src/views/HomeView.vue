<template>
  <div id="homeForm" class="bg-cyan-950 h-screen">
    <main class="flex flex-col justify-center items-center gap-16 h-full">
      <h2 class="text-4xl font-semibold text-white">Formulaires :</h2>
      <button
        class="px-6 py-3 bg-white text-blue font-medium rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
      >
        Ajouter une tournée !
      </button>
      <h2 class="text-4xl font-semibold text-white">Dettes :</h2>
      <button
        class="px-6 py-3 bg-white text-blue font-medium rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
      >
        Payer une dette !
      </button>
      <h2 class="text-4xl font-semibold text-white">Tableau de bord :</h2>
      <button
        class="px-6 py-3 bg-white text-blue font-medium rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
      >
        Voir le tableau de bord
      </button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>

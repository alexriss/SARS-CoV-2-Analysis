<template>
  <div id="app" style="max-width:1400px;">
    <h1 class="title">SARS-CoV-2 Analysis</h1>
    <CovTable />
  </div>
</template>

<script>
import CovTable from '@/components/CovTable.vue'

export default {
  name: 'App',
  components: {
    CovTable,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>


<style lang="scss">
  // Import Bulma's core
  @import "~bulma/sass/utilities/_all";
  //@import "~bulma/sass/elements/table.sass";
  //@import "~buefy/src/scss/components/_table.scss";

  // Set your colors
  $primary: #3179bd;
  $primary-invert: findColorInvert($primary);
  $twitter: #3671b4;
  $twitter-invert: findColorInvert($twitter);
  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
      "white": ($white, $black),
      "black": ($black, $white),
      "light": ($light, $light-invert),
      "dark": ($dark, $dark-invert),
      "primary": ($primary, $primary-invert),
      "info": ($info, $info-invert),
      "success": ($success, $success-invert),
      "warning": ($warning, $warning-invert),
      "danger": ($danger, $danger-invert),
      "twitter": ($twitter, $twitter-invert)
  );
  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
  //@import "~buefy/src/scss/components/_table.scss";

</style>

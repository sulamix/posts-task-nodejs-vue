
<template>
  <div id="app" class="main">
        <add-post></add-post>
        <list-post></list-post>
        <manage-user></manage-user>
  </div>
</template>


<script>
  import AddPost from './AddPost.vue';
  import ListPost from './ListPost.vue';
  import ManageUser from './ManageUser.vue';

  export default {
    name: 'app',
    data() {
      return {}
    },
    components: {
      AddPost,
      ListPost,
      ManageUser,
    },
  }
</script>

<!-- Please ignore unused classes -->
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
</style>

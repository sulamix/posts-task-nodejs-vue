
<template>
  <div>
    <form @submit.prevent class="signin-form profile mrb-30">
      <h3>Send New Post</h3>
      <div class="form-group">
        <input type="text" class="form-control" @keypress="typing=true" placeholder="write the post message here" v-model="post.text">

        <button class="input-group-addon addon-left" title="Send"
              v-on:click="addPost($event)">Send</button>
      </div>
    </form>
  </div>
</template>


<script>
  import axios from 'axios';
  import bus from "./../bus.js";
  var uri = 'http://localhost:4000/api/post';

  export default {
    data() {
      return {
        post: {text: ''},
        typing: false,
      }
    },

    methods: {
      addPost(event) {
        if (event) event.preventDefault();

        socket.emit('add_post', this.post); // server logic not implemented

        axios.post(uri+'/add', this.post).then((response) => {
          this.clearPost();
          this.refreshPost();
          this.typing = false;
        }).catch((error) => {
          console.log(error);
        })
      },

      clearPost() {
        this.post = {text: ''};
      },

      refreshPost() {
         bus.$emit("refreshPost");
      }
    }
  }
</script>

<style scoped>
    .mrb-30 {
        margin-bottom: 30px;
    }
</style>
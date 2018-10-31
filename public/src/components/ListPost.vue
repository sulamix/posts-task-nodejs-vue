
<template>
    <div class="w3">
        <div class="signin-form profile">
            <h3>Feeds</h3>
            <div class="row mrb-10" v-for="post in posts">
                <div class="post">
                    <span class="form-control"> {{post.User.name}} ,</span>
                    <span class="form-control"> {{post.date}} :</span> <br/>
                    <span class="post-text"> {{post.text}} </span>
                </div>
                <hr>
            </div>
            <div v-show="posts.length==0">
                <p class="alert alert-info">
                    You do not have any feeds
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import bus from './../bus.js';
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    export default {
        data() {
            return {
                posts: [],
            }
        },

        created: function () {
            this.fetchPosts();
            this.listenToEvents();
        },

        mounted: function () {
            //setInterval(() => bus.$emit('refreshPost'), 5000)
        },

        methods: {
            fetchPosts() {
                let uri = 'http://localhost:4000/api/post/all';

                axios.get(uri).then(response => {
                    this.posts = response.data;
                    this.posts.forEach(post => {
                        post.date = this.formatDate(new Date(post.createdAt))
                    })
                });
            },

            listenToEvents() {
                bus.$on('refreshPost', ($event) => {
                    this.fetchPosts();
                })

                // update the user feeds with a new friend post
                socket.on('add_feed', post => {
                    this.posts.unshift(post)
                });
            },

            formatDate(date) {
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();
                return day + ' ' + monthNames[monthIndex] + ' ' + year;
            }
        }
    }
</script>

<!-- Please ignore unused classes -->
<style scoped>
    .no_border_left_right {
        border-left: 0px;
        border-right: 0px;
    }

    .flat_form {
        border-radius: 0px;
    }

    .mrb-10 {
        margin-bottom: 10px;
    }

    .addon-left {
        background-color: none !important;
        border-left: 0px !important;
        cursor: pointer !important;
    }

    .addon-right {
        background-color: none !important;
        border-right: 0px !important;
    }

    .post-text {
        color: #fff;
        font-weight: 700;
    }
</style>

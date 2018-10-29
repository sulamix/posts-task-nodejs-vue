
<template>
<!-- Please ignore unused classes -->
<div class="agile">
    <div class="signin-form profile">
        <h3>Manage Friends</h3>
        <div class="col-md-12" v-show="friend_to_approve.length>0">
            <div class="row mrb-10" v-for="user in friend_to_approve">
                <div class="user_container">
                    <span class="user_name"> {{user.name}} </span>
                    <button class="input-group-addon addon-left manage-btn" title="Accept"
                        v-on:click="acceptFriendRequest($event, user)">Accept Request</button>
                </div>
            </div>
        </div>
        <div class="col-md-12" v-show="friend_requests.length>0">
            <div class="row mrb-10" v-for="user in friend_requests">
                <hr>
                <div class="user_container">
                    <span class="user_name"> {{user.name}} </span>
                    <span class="f-right"> Request Sent </span>
                </div>
            </div>
        </div>
        <div class="col-md-12" v-show="friends.length>0">
            <div class="row mrb-10" v-for="user in friends">
                <hr>
                <div class="user_container">
                    <span class="user_name"> {{user.name}} </span>
                    <span class="f-right"> A Friend </span>
                </div>
            </div>
        </div>
        <div class="col-md-12" v-show="users.length>0">
            <div class="row mrb-10" v-for="user in users" v-show="!user.hide">
                <hr>
                <div class="user_container">
                    <span class="user_name"> {{user.name}} </span>
                    <button class="input-group-addon addon-left manage-btn" title="Add"
                        v-on:click="sendFriendRequest($event, user)">Send Request</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import axios from 'axios';
    import bus from './../bus.js'
    var uri = 'http://localhost:4000/api/user';

    export default {
        data() {
            return {
                friend_to_approve: [],
                friend_requests: [],
                friends: [],
                users: [],
                existIdsArr: [],
            }
        },

        created: function () {
            this.fetchUser();
            this.listenToEvents();
        },

        mounted: function () {
            //setInterval(() => bus.$emit('refreshUser'), 5000)
        },

        methods: {
            sendFriendRequest(event, friend) {
                if (event) event.preventDefault();
                axios.post(uri+'/ask_friend', {friendId: friend.id}).then((response) => {
                    this.fetchUser();
                })
            },
            acceptFriendRequest(event, friend) {
                if (event) event.preventDefault();
                axios.post(uri+'/add_friend', {friendId: friend.id}).then((response) => {
                    this.fetchUser();
                    bus.$emit('refreshPost')
                })
            },
            fetchUser() {
                this.existIdsArr = [];
                axios.get(uri+'/friends').then((response) => {
                    this.friends = response.data;
                    this.friends.forEach(user => {this.existIdsArr.push(user.id)});
                    
                    axios.get(uri+'/friend_requests').then((response) => {
                        this.friend_requests = response.data;
                        this.friend_requests.forEach(user => {
                            this.existIdsArr.push(user.id)
                        })
                        axios.get(uri+'/friend_to_approve').then((response) => {
                            this.friend_to_approve = response.data;
                            this.friend_to_approve.forEach(user => {
                                this.existIdsArr.push(user.id)
                            })
                            axios.get(uri+'/all').then((response) => {
                                this.users = response.data;
                                this.users.forEach(user => {
                                    if (this.existIdsArr.indexOf(user.id) > -1) {
                                        user.hide = true;
                                    }
                                });
                            });
                        });
                    });
                })
            },

            listenToEvents() {
                bus.$on('refreshUser', ($event) => {
                    this.fetchUser();
                })
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

    .user_name {
        color: #fff;
        font-weight: 700;
    }

    .user_container {
        text-align: left;
    }

    .f-right {
        float : right;
    }

    .manage-btn {
        font-size: 0.8em;
        margin: 0 !important;
        width: auto;
        padding: 5px 12px;
        float: right;
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
</style>

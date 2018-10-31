
<template>
<!-- Please ignore unused classes -->
<div class="agile">
    <div class="signin-form profile">
        <h3>Manage Friends</h3>
        <div class="col-md-12" v-show="users.length>0">
            <div class="row mrb-10" v-for="user in users" v-show="!user.hide">
                <hr>
                <div class="user_container">
                    <span class="user_name"> {{user.name}}</span>
                    
                    <span class="f-right" v-show="user.status=='friend'"> A Friend </span>
                    <span class="f-right" v-show="user.status=='friend_request'"> Request Sent </span>
                    <button class="input-group-addon addon-left manage-btn" title="Accept" v-show="user.status=='friend_to_approve'"
                        v-on:click="acceptFriendRequest($event, user)">Accept Request</button>
                    <button class="input-group-addon addon-left manage-btn" title="Add" v-show="user.status=='not_friend'"
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
                var users = this.users;
                axios.post(uri+'/ask_friend', {friendId: friend.id}).then((response) => {
                    friend.status = 'friend_request';
                })
            },
            acceptFriendRequest(event, friend) {
                if (event) event.preventDefault();
                axios.post(uri+'/add_friend', {friendId: friend.id}).then((response) => {
                    friend.status = 'friend';
                    bus.$emit('refreshPost')
                })
            },
            fetchUser() {
                var promises = [];
                promises.push(axios.get(uri+'/friends', {status:'friend'}))
                promises.push(axios.get(uri+'/friend_requests', {status:'friend_request'}))
                promises.push(axios.get(uri+'/friend_to_approve', {status:'friend_to_approve'}))

                axios.all(promises)
                    .then(axios.spread((...args) => {
                        var users = [];
                        var relatedUserIds = [];
                        for (let i = 0; i < args.length; i++) {
                            var status = args[i].config.status;
                            args[i].data.forEach(user => {
                                relatedUserIds.push(user.id)
                                user.status = status
                                users.push(user)
                            });  
                        }
                        
                        // will display the related users first
                        this.users = users;
                        // will load all the other users
                        axios.get(uri+'/all').then(response => {
                            response.data.forEach(user => {
                                if (relatedUserIds.indexOf(user.id) == -1) {
                                    //The user is not in a related array
                                    user.status = "not_friend"
                                    this.users.push(user)  
                                }
                            });
                        })
                    }))
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

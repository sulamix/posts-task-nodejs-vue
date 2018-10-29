const fs = require('fs');
var posts = [],
    lastUsedID = 0

class Post {
  constructor(text, date=null, user=1) {
    this.id = 0
    this.text = text
    this.date = (!date || data instanceof Date)? date : new Date(date)
  }

  static compare(postA, postB) { // to use posts_arr.sort(Post.compare)
    return postA.date - postB.date
  }

  static getAll(callback) {
    setTimeout(function () { //working like async DB
      callback(null, posts)
    }, 10)
  }

  static create(post, callback) {
    lastUsedID++
    post.id = lastUsedID
    posts.push(post)
    callback(null, post)
  }

  static findById(id, callback) {
    var post = posts.filter(elm => elm.id == id)[0]
    callback(null, post)
  }
}

module.exports = Post

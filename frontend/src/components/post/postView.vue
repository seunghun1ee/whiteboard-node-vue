<template>
  <div>
    <h1><a v-if="unit" v-bind:href="'/units/'+unit._id+'/forum/'">{{unit.code}} {{unit.title}} Forum</a></h1>
    <hr>
    <div v-if="post">
      <h2>{{post.title}}</h2>
      <div v-if="post.tags.length > 0">
        <p v-for="tag in post.tags" :key="tag">{{tag}} | </p>
      </div>
      <p v-else class="mb-0">No tags</p>

      <div class="mb-3">
        <a v-if="post.anonymous">Anonymous</a>
        <a v-else>{{post.author}}</a>
        <small class="text-muted"> | {{new Intl.DateTimeFormat("en-GB",this.dateFormatOption).format(new Date(post.createdAt))}}</small>
      </div>
      <div class="mb-5">
        <p>{{post.body}}</p>
      </div>
      <small v-if="post.comments.length === 1" :key="post.comments.length">1 Comment</small>
      <small v-else :key="post.comments.length">{{post.comments.length}} Comments</small>
      <hr>
      <comment v-for="comment in post.comments" :key="comment.body" v-bind:comment-data="comment"></comment>
    </div>

    <new-comment-form @newCommentSaved="onNewCommentSaved"></new-comment-form>

  </div>
</template>

<script>
import {getUnitById} from "@/unitRepository";
import {getPostById} from "@/postRepository";
import unit from "@/components/unit";
import Comment from "@/components/post/comment";
import NewCommentForm from "@/components/post/newCommentForm";

const room = location.pathname;
export default {
  name: "postView",
  components: {NewCommentForm, Comment},
  data() {
    return {
      unit: null,
      post: null,
      dateFormatOption: {
        dateStyle: "medium",
        timeStyle: "medium"
      }
    }
  },
  sockets: {
    new_comment: function (comment) {
      this.post.comments.push(comment);
    }
  },
  created() {
    console.log(this.$route.params);
    let unitId = this.$route.params.id;
    let postId = this.$route.params.postId;
    getUnitById(unitId).then(data => {
      this.unit = data;
      console.log(unit);
    }).catch(err => alert(err));
    getPostById(postId)
        .then(data => {
          this.post = data;
          console.log(data);
        })
        .catch(err => alert(err));
  },
  mounted() {
    this.$socket.emit("room",room);
  },
  methods: {
    onNewCommentSaved(newComment) {
      const vue = this;
      this.post.comments.push(newComment);
      vue.$socket.emit("save_new_comment",newComment,room);
    }
  }
}
</script>

<style scoped>

</style>
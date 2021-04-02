<template>
  <div>
    <div>
      <h1>{{unit.code}} {{unit.name}}</h1>
      <p>Unit director: {{unit.director}}</p>
      <p>Staffs:</p>
    </div>
    <div>
      <h2>Unit forums</h2>
      <ul>
        <li><a v-bind:href="unit.id + '/forum/'">Discussion forum</a></li>
        <li><a href="#">Announcments</a></li>
      </ul>
    </div>
    <div>
      <h2>Recorded lectures</h2>
      <article class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <article v-for="video in videos" v-bind:key="video.id" class="col">
          <img src="https://via.placeholder.com/160x90.png?text=Video+thumbnail">
          <p><a href="#">{{video.title}}</a></p>
          <p>Uploaded 1 day ago</p>
          <p><a href="#">{{video.uploader}}</a></p>
        </article>
      </article>
    </div>
  </div>
</template>

<script>
import {getUnitById} from "@/unitRepository";

export default {
  name: "unit",
  data() {
    return {
      unit: {id: 0, code: "COMS10000", name: "CS Basics", director: "Alice Wonderland", staffs: [], videos: []},
      videos: []
    }
  },
  methods: {

  },
  mounted() {
    getUnitById(this.$route.params.id).then(data => this.unit = data).catch(err => alert(err));
    console.log(this.$route.params);
  }
}
</script>

<style scoped>

</style>
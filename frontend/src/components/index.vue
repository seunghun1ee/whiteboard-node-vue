<template>
  <div>
    <div>
      <h1>Welcome to Whiteboard</h1>
    </div>
    <div class="row row-cols-1 row-cols-md-2">
      <div class="col">
        <h3>My units</h3>
        <ul>
          <li v-for="unit in units" v-bind:key="unit._id">
            <a v-bind:href="'/units/' + unit._id">{{unit.code}} {{unit.title}}</a>
          </li>
        </ul>
      </div>
      <div class="col">
        <h3>Announcements</h3>
        <ul>
          <li><a href="#">Lorem ipsum dolor sit amet, consectetur adipiscing elit</a></li>
          <li><a href="#">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</a></li>
          <li><a href="#">Excepteur sint occaecat cupidatat non proident</a></li>
          <li><a href="#">Ut enim ad minima veniam, quis nostrum exercitationem</a></li>
        </ul>
      </div>
    </div>
    <hr>
    <div>
      <h3>Live Sessions</h3>
      <ul>
        <li><a v-bind:href="'/live/'">COMS10000 CS Basics</a></li>
      </ul>
    </div>
    <hr>
    <div>
      <h3>Assessments</h3>
      <p>
        <a href="/assessments">Go to Assessments Dashboard
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
        </svg>
        </a>
      </p>
    </div>
    <hr>
    <div>
      <h3>Recently Uploaded</h3>
      <article class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
        <article v-for="video in videos" v-bind:key="video.id" class="col">
          <img src="https://via.placeholder.com/160x90.png?text=Video+thumbnail">
          <p><a href="#">{{video.title}}</a></p>
          <p><a v-bind:href="'/units/' + video.id + '/'">{{video.unitCode}} {{video.unitName}}</a></p>
          <p>Uploaded 1 day ago</p>
          <p><a href="#">{{video.uploader}}</a></p>
        </article>
      </article>
      <p><a href="/videos" class="btn btn-primary">More lectures</a></p>
    </div>
  </div>
</template>

<script>
import { getUnits } from "@/unitRepository";
import { getVideos } from "@/videoRepository";

export default {
  name: "index",
  data() {
    return {
      units: [],
      videos: []
    }
  },
  methods: {

  },
  created() {
    getUnits()
        .then(data => {
          this.units = data
          console.log(data);
        })
        .catch(err => alert(err));
    getVideos()
        .then(data => this.videos = data)
        .catch(err => alert(err));
  }
}
</script>

<style scoped>

</style>
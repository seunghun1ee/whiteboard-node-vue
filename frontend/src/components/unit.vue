<template>
  <div>
    <div>
      <h1>{{unit.code}} {{unit.title}}</h1>
      <p class="mb-0">Unit director: {{unit.director}}</p>
      <p v-if="unit.staffs.length > 0" class="mb-0">Staffs</p>
      <ul v-if="unit.staffs.length > 0">
        <li v-for="staff in unit.staffs" :key="staff">{{staff}}</li>
      </ul>
    </div>
    <hr>
    <div>
      <h2>Unit forum</h2>
      <p><a v-bind:href="unit._id + '/forum/'">Go to unit forum
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
        </svg>
      </a></p>
      <hr>
    </div>

    <div>
      <h2>Assessments</h2>
      <ul>
        <li><a href="/coursework/1/">Demo Coursework</a></li>
      </ul>
      <hr>
    </div>

    <div>
      <h2 class="mb-4">Unit Information</h2>
      <h3>Welcome</h3>
      <p>Welcome to the test unit</p>
      <h3>Teaching plan</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ligula erat, semper eget ultricies a, luctus ac metus. Duis in laoreet dolor, non imperdiet nisl. Nam leo lacus, eleifend at congue vitae, vestibulum ut nisl. Donec sit amet vestibulum ante, ac scelerisque justo. Integer porta in tellus vitae malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed pellentesque lorem a fringilla ultrices. Donec in laoreet tellus. In nec rutrum justo. Sed sed lorem iaculis velit ornare ullamcorper. Donec nisi nulla, sodales condimentum ante nec, interdum pharetra justo. Vivamus eu diam ut est consectetur mollis eget et urna. Phasellus vel erat tempus, scelerisque ex nec, mattis neque.</p>
      <p>Vestibulum in diam libero. Etiam aliquam ante eu semper vestibulum. Suspendisse consequat lectus neque, et euismod nibh consectetur id. Nulla consequat semper sem, a ultrices velit tincidunt ut. Maecenas sollicitudin convallis bibendum. Aliquam consectetur leo id faucibus dignissim. Nulla rhoncus malesuada leo a lobortis. Donec venenatis lectus ut lobortis accumsan.</p>
      <p>Praesent libero tortor, posuere quis orci eget, vulputate facilisis mauris. Ut quis nibh efficitur, mattis eros id, ultricies magna. Donec sit amet malesuada velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent condimentum magna erat, sed laoreet ante tincidunt non. Aliquam a nulla lectus. Praesent tincidunt efficitur sem eu maximus. Etiam cursus accumsan neque at auctor. Etiam posuere placerat sapien, vel suscipit orci convallis sed. Sed elementum nec sem eu rhoncus. Ut quis dolor eu sapien auctor congue. Aenean tempor sapien ac velit convallis vehicula. In placerat orci metus, nec pretium justo faucibus quis. Mauris ante metus, vestibulum non diam in, porta convallis enim. Nullam commodo tempus ante non ornare. Etiam erat diam, auctor nec dolor a, condimentum dapibus neque.</p>
      <h3>Assessments</h3>
      <p>This unit will be assessed with 100% coursework. Please check the Coursework section to see the detail</p>
      <hr>
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
  created() {
    getUnitById(this.$route.params.id).then(data => this.unit = data).catch(err => alert(err));
    console.log(this.$route.params);
  }
}
</script>

<style scoped>

</style>
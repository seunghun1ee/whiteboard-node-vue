<template>
  <div>
    <h1>{{title}}</h1>
    <p>Deadline: {{deadline.toLocaleString("en-GB")}}</p>
    <br>
    <h2>Description</h2>
    <hr>
    <div v-html="description"></div>
    <br>
    <h2>Attached files</h2>
    <hr>
    <ul>
      <li v-for="file in attachedFiles" :key="file.id">
        <a href="#" v-on:click="downloadFile(file.filePath)">{{file.fileName}}</a>
      </li>
    </ul>
    <br>
    <h2>Submission point</h2>
    <hr>
    <form class="mb-3">
      <label class="form-label">Attach files</label>
      <input class="form-control mb-2" placeholder="Attach files" type="file" multiple required>
      <textarea class="form-control mb-2" placeholder="Text Submission" style="height: 9rem"></textarea>
      <button class="btn btn-primary" type="submit" v-on:click="submit">Submit coursework</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "coursework",
  data() {
    return {
      title: "Demo Coursework",
      deadline: new Date("2021-05-05T13:00:00"),
      description:
          "<h5>Intro</h5>" +
          " <p>This demo coursework will test your ability to write a simple sentence on a given document.</p>" +
          "<h5>Tasks</h5> \n" +
          " <p>Use the attached Word file and write \"Good night\".</p>" +
          " <p>On submission, attach the document and write \"See you\" at text submission.</p>" +
          " <h5>Deadline</h5>" +
          " <p>The deadline of the coursework is 05/05/2021 13:00</p>",
      attachedFiles: [{id: 0, fileName: "Demo-Coursework.docx", filePath: `${process.env.VUE_APP_BACKEND}/files/Demo-Coursework.docx`}]
    }
  },
  methods: {
    downloadFile(filePath) {
      window.open(filePath);
    },
    submit() {
      alert('Your coursework is submitted');
    }
  }
}
</script>

<style scoped>

</style>
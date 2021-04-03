<template>
  <div>
    <input v-on:change="getUrlFile" id="shareFileUrlInput" type="url" class="form-control form-control-sm" placeholder="File URL">
    <input v-on:change="getLocalFile" id="shareFileLocalInput" type="file" class="form-control form-control-sm">
    <pdf-document v-bind="{url,data,scale}" :key="url + data"></pdf-document>
  </div>
</template>

<script>
import PdfDocument from "@/components/pdfDocument";
export default {
  name: "pdfView",
  components: {PdfDocument},
  data() {
    return {
      url: null,
      data: null,
      scale: 1
    }
  },
  methods: {
    getLocalFile(event) {
      const file = event.target.files[0];
      if(!file) {
        return;
      }
      console.log(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.data = new Uint8Array(e.target.result);
      };
      fileReader.readAsArrayBuffer(file);
      this.url = null;
    },
    getUrlFile(event) {
      console.log(event);
      console.log(event.target.value);
      this.url = event.target.value;
      this.data = null;
    }
  }
}
</script>

<style scoped>

</style>
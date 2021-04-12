<template>
  <div>
    <form enctype="multipart/form-data">
      <label class="form-label">Share pdf</label>
      <input v-on:change="onFileUpload" type="file" class="form-control form-control-sm">
    </form>
    <br>
    <input v-on:change="getUrlFile" id="shareFileUrlInput" type="url" class="form-control form-control-sm" placeholder="File URL">
    <input v-on:change="getLocalFile" id="shareFileLocalInput" type="file" class="form-control form-control-sm">
    <pdf-document v-bind="{url,data,scale}" :key="url + data"></pdf-document>
  </div>
</template>

<script>
import PdfDocument from "@/components/pdf/pdfDocument";
import {uploadPdf} from "@/pdfHandler";

export default {
  name: "pdfView",
  components: {PdfDocument},
  data() {
    return {
      url: null,
      data: null,
      scale: 1,
      pdfFile: null
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
    },
    onFileUpload(event) {
      this.pdfFile = event.target.files[0];
      if(!this.pdfFile) {
        return;
      }
      const formData = new FormData();
      formData.append("pdf",this.pdfFile,this.pdfFile.name);
      console.log(formData);
      uploadPdf(formData).then(res => {
        console.log(res);
      }).catch(err => alert(err));
    }
  }
}
</script>

<style scoped>

</style>
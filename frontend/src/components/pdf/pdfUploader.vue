<template>
  <div>
    <form enctype="multipart/form-data">
      <label class="form-label">Share pdf</label>
      <input v-on:change="onFileUpload" type="file" class="form-control form-control-sm">
    </form>
  </div>
</template>

<script>
import {uploadPdf} from "@/pdfHandler";

export default {
  name: "pdfUploader",
  data() {
    return {
      allowedTypes: ["application/pdf"],
      pdfFile: null
    }
  },
  methods: {
    validateFile(file) {
      return this.allowedTypes.includes(file.type);
    },
    onFileUpload(event) {
      this.pdfFile = event.target.files[0];
      if(!this.pdfFile) {
        return;
      }
      if(!this.validateFile(this.pdfFile)) {
        alert("You can only present PDF files");
        return;
      }
      const formData = new FormData();
      formData.append("pdf",this.pdfFile,this.pdfFile.name);
      uploadPdf(formData).then(res => {
        console.log(res);
      }).catch(err => alert(err));
    }
  }
}
</script>

<style scoped>

</style>
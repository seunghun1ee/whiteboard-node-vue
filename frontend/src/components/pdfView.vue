<template>
  <pdf-document v-bind="{url, scale}"></pdf-document>
</template>

<script>


import PdfDocument from "@/components/pdfDocument";
export default {
  name: "pdfView",
  components: {PdfDocument},
  data() {
    return {
      url: "https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS",
      scale: 1
    }
  }
}
</script>

<style scoped>

</style>
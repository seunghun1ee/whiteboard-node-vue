<template>
  <div>
    <pdf-page v-for="page in pages" v-bind="{page, scale}" :key="page.pageNumber"></pdf-page>
  </div>
</template>

<script>
import lodashRange from "lodash/range";
import PdfPage from "@/components/pdfPage";

export default {
  name: "pdfDocument",
  props: ["url","data","scale"],
  components: {PdfPage},
  data() {
    return {
      pdf: undefined,
      pages: []
    }
  },
  created() {
    this.fetchPDF();
  },
  methods: {
    fetchPDF() {
      import("pdfjs-dist")
        .then(pdfjs => {
          pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js";
          if(this.url) {
            return pdfjs.getDocument(this.url).promise;
          }
          else if(this.data) {
            return pdfjs.getDocument({data:this.data}).promise;
          }
          return null;
        }).then(pdf => {
        this.pdf = pdf
        console.log("get document done",this.pdf);
      });
    }
  },
  watch: {
    pdf: function (pdf) {
      this.pages = [];
      console.log("pdf watcher",pdf);
      const pagePromises = lodashRange(1, pdf.numPages)
          .map(number => pdf.getPage(number));
      Promise.all(pagePromises)
          .then(pages => {this.pages = pages; console.log(this.pages)});
    }
  }
}
</script>

<style scoped>

</style>
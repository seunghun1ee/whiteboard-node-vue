<template>
  <div>
    <button v-on:click="prevPage" class="btn btn-primary">prev</button>
    <button v-on:click="nextPage" class="btn btn-primary">next</button>
    <pdf-page v-if="pages[currentPage]" v-bind="{page:pages[currentPage],scale:scale}" :key="currentPage"></pdf-page>
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
      pages: [],
      currentPage: 0
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
    },
    nextPage() {
      if(this.currentPage < this.pages.length - 1) {
        this.currentPage++;
      }
    },
    prevPage() {
      if(this.currentPage > 0) {
        this.currentPage--;
      }
    }
  },
  watch: {
    pdf: function (pdf) {
      this.pages = [];
      this.currentPage = 0;
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
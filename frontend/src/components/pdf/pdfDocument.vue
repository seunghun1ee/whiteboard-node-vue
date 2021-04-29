<template>
  <div>
    <button v-on:click="prevPage" class="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
    </button>
    <button v-on:click="nextPage" class="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
      </svg>
    </button>
    <p v-if="currentPage + 1 <= pages.length">{{currentPage + 1}} / {{pages.length}}</p>
    <p v-else>Slide show finished</p>
    <br>
    <pdf-page v-if="pages[currentPage] && scales[currentPage]" v-bind="{page:pages[currentPage],scale:scales[currentPage]}" :key="currentPage"></pdf-page>
  </div>
</template>

<script>
import lodashRange from "lodash/range";
import PdfPage from "@/components/pdf/pdfPage";

export default {
  name: "pdfDocument",
  props: {
    url: String,
    data: [Uint8Array,String],
    scale: Number
  },
  components: {PdfPage},
  data() {
    return {
      pdf: undefined,
      pages: [],
      scales: [],
      currentPage: 0,
      parentWidth: 0,
      parentHeight: 0
    }
  },
  sockets:{
    pdf_page_changed: function (pageNum) {
      this.currentPage = pageNum;
    }
  },
  created() {
    this.parentWidth = this.$parent.$el.offsetWidth * 0.7;
    this.parentHeight = window.innerHeight * 0.7;
    this.fetchPDF();
    console.log("parent", this.parentWidth, this.parentHeight);
  },
  mounted() {

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
      if(this.currentPage < this.pages.length) {
        this.currentPage++;
        this.$socket.emit("pdf_page_change",this.currentPage);
      }
    },
    prevPage() {
      if(this.currentPage > 0) {
        this.currentPage--;
        this.$socket.emit("pdf_page_change",this.currentPage);
      }
    }
  },
  watch: {
    pdf: function (pdf) {
      if(pdf) {
        this.pages = [];
        this.currentPage = 0;
        console.log("pdf watcher",pdf);
        const pagePromises = lodashRange(1, pdf.numPages+1)
            .map(number => pdf.getPage(number));
        Promise.all(pagePromises)
            .then(pages => {this.pages = pages; console.log(this.pages)})
            .then(() => {
              this.pages.map(page => {
                const temp = page.getViewport({scale: 1});
                const scale = Math.min((this.parentWidth/temp.width),(this.parentHeight/temp.height));
                this.scales.push(scale);
              })
            });
      }
    }
  }
}
</script>

<style scoped>

</style>
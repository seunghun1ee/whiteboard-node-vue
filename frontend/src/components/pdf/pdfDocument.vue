<template>
  <div>
    <button v-on:click="prevPage" class="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
      </svg>
    </button>
    <button v-on:click="nextPage" class="btn btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
      </svg>
    </button>
    <p class="mb-0" v-if="currentPage + 1 <= pages.length">{{currentPage + 1}} / {{pages.length}}</p>
    <p class="mb-0" v-else>Slide show finished</p>
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
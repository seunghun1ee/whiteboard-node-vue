<script>
export default {
  name: "pdfPage",
  props: {
    page: Object,
    scale: Number
  },
  render(createElement) {
    const {canvasAttrs: attrs} = this;
    return createElement("canvas",{attrs});
  },
  created() {
    this.viewport = this.page.getViewport({scale: this.scale});
  },
  mounted() {
    this.drawPage();
  },
  computed: {
    canvasAttrs() {
      let {width, height} = this.viewport;
      [width, height] = [width, height].map(dimension => Math.ceil(dimension));

      const style = this.canvasStyle;

      return {width,height,style,class: "pdf-page"};
    },
    canvasStyle() {
      const {width: actualSizeWidth, height: actualSizeHeight} = this.actualSizeViewport;
      console.log("pdfPage", this.actualSizeViewport);
      const pixelRatio = window.devicePixelRatio || 1;
      const [pixelWidth, pixelHeight] = [actualSizeWidth, actualSizeHeight]
          .map(dim => Math.ceil(dim / pixelRatio));
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`
    },
    actualSizeViewport() {
      return this.viewport.clone({scale: this.scale});
    }
  },
  methods: {
    drawPage() {
      if(this.renderTask) return;

      const {viewport} = this;
      const canvasContext = this.$el.getContext('2d');
      const renderContext = {canvasContext, viewport};

      // PDFPageProxy#render
      this.renderTask = this.page.render(renderContext);
      this.renderTask.promise.then(() => {
        this.$emit('rendered', this.page);
        console.log("page rendered",this.page);
      });
    }
  }
}
</script>

<style scoped>

</style>
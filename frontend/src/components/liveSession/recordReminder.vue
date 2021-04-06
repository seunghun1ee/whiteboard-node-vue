<template>
  <div class="position-fixed bottom-0 start-0 p-3" style="z-index: 5">
    <div class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        This is a friendly reminder to record your lecture :)
        <div class="mt-2 pt-2 border-top">
          <button id="toastRecordButton" type="button" class="btn btn-danger btn-sm">Record</button>
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "recordReminder"
}
</script>

<style scoped>

</style>
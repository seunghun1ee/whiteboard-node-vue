<template>
  <div>
    <h1>Coursework title</h1>
    <p>Deadline: dateTime</p>
    <br>
    <h2>Description</h2>
    <hr>
    <p>asdf</p>
    <h2>Attached files</h2>
    <hr>
    <p>Files here</p>
    <h2>Submission point</h2>
    <hr>
    <form>
      <label class="form-label">Attach files</label>
      <input class="form-control" placeholder="Attach files" type="file" multiple required>
      <textarea class="form-control" placeholder="Description"></textarea>
      <button class="btn btn-primary" type="submit">Submit coursework</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "coursework"
}
</script>

<style scoped>

</style>
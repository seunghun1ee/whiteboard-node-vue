<template>
  <div>
    <h1>Your Assessments</h1>
    <br>
    <h2>Exams</h2>
    <hr>
    <div class="row row-cols-1 row-cols-sm-3">
      <div class="col">
        <h3>Live Exam</h3>
        <p>You don't have any live exams now</p>
      </div>
      <div class="col">
        <h3>Exam today</h3>
        <p>You don't have any exams today</p>
      </div>
      <div class="col">
        <h3>Upcoming exams</h3>
        <ul>
          <li>COMS10000 CS Basics - 10:00 20/May/2021</li>
          <li>COMS10002 Security - 09:00 25/May/2021</li>
        </ul>
      </div>
    </div>
    <br>
    <h2>Coursework</h2>
    <hr>
    <ul>
      <li>
        <a href="/coursework/1/">Demo Coursework - COMS10001 Theory of Computation</a> - {{timeLeft}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "assessmentDashboard",
  data() {
    return {
      date: new Date("2021-05-05T13:00:00"),
      timeLeft: ""
    }
  },
  created() {
    const timeDifference = this.date.getTime() - Date.now();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    const daysOnly = Math.trunc(dayDifference);
    const timeOnly = Math.trunc((dayDifference - daysOnly) * 24)
    this.timeLeft = `${daysOnly} days ${timeOnly} hours left`;
  }
}
</script>

<style scoped>

</style>
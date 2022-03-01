<template>
  <div>This is report page in branch featured1</div>
</template>

<script>
export default {
  created() {
    this.$axios({
      url: `${process.env.baseAPI}/result`,
      method: "GET"
    }).then(res => console.log("res", res.data));
  }
};
</script>
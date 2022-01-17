<template>
  <div>This is report page</div>
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
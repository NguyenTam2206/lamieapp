<template>
  <div>
    <div>one</div>
    <div>two</div>
    <div>three</div>
  </div>
</template>

<script>
export default {
  created() {
    this.$axios({
      url: `${process.env.baseAPI}/result`,
      method: "GET",
    }).then((res) => console.log("res", res.data));
  },
};
</script>
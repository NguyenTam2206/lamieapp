import Vue from "vue";
import moment from "moment";

// Vue.filter("formatDate", (value, format) => {
//   return value ? moment(value).format(format) : "";
// });
// Vue.filter("datetime", function(value, format = "") {
//   return moment(value).format(format);
// });

// Vue.filter("textTruncate", function(str, length = 1000) {
//   if (typeof str === "string") {
//     const truncate = (str, max, suffix) =>
//       str.length < max
//         ? str
//         : `${str.substr(
//             0,
//             str.substr(0, max - suffix.length).lastIndexOf(" ")
//           )}${suffix}`;
//     return truncate(str, length, "...");
//   } else {
//     return;
//   }
// });

Vue.filter("currency", function(value, ext = "") {
  if (value === "Miễn phí" || value === "Không") {
    return value;
  }
  if (value === "") {
    return;
  }
  return (
    (value || "0")
      .toString()
      .replace(/[^0-9]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + `${ext ? ext : ""}`
  );
});

module.exports = {
    default: {
      require: ["features/step_definitions/tickets.steps.js"],
      format: ["html:reports/cucumber_report.html"],
      paths: ["features/*.feature"],
    },
  };
  
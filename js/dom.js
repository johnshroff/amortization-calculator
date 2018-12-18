var amo;
$("#loanSubmit").click(function() {
  $("#paymentScheduleTable").remove();
  $("#overviewPanel").remove();
  var loanAmount = $("#loanAmount").val(),
    interestRate = $("#interestRate").val() / 100,
    termLength = $("#termLength").val();

    if (loanAmount == 0 || interestRate == 0 || termLength == 0) {
      alert('All fields are required to create the payment schedule');
      return;
    }

    amo = new amortization(loanAmount, interestRate, termLength);
    amo.calculateMonthlyPayment();
    $("#defaultPaymentLabel").val(amo.getMonthlyPayment());
    $("#actualPaymentModal").modal();
});
$("#actualPaymentModal").on("shown.bs.modal", function() {
  $("#actualPaymentLabel").focus();
});
$("#createPaymentScheduleButton").click(function() {
  var table = $("<table>", {class: "table", id: "paymentScheduleTable"});
    amo.actualMonthlyPayment = $("#actualPaymentLabel").val();

  var payments = amo.getPaymentSchedule();

  var overviewPanel = $("<div>", {id: "overviewPanel"}),
    defaultPayment = $("<h4>", {text: "Default Monthly Payment: " + amo.getMonthlyPayment()}),
    actualPayment = $("<h4>", {text: "Actual Monthly Payment: " + amo.actualMonthlyPayment}),
    defaultInterestPaid = $("<h4>", {text: "Default Total Interest: " + amo.getDefaultInterestPaid()}),
    actualInterestPaid = $("<h4>", {text: "Actual Total Interest: " + amo.getActualInterestPaid()}),
    totalInterestSaved = $("<h4>", {text: "Total Savings: " + amo.getTotalSavings()});

  overviewPanel.append(defaultPayment);
  overviewPanel.append(actualPayment);
  overviewPanel.append(defaultInterestPaid);
  overviewPanel.append(actualInterestPaid);
  overviewPanel.append(totalInterestSaved);

  $("#main").append(overviewPanel);

  var thead = $("<thead>")
      tbody = $("<tbody>"),
      tr = $("<tr>");

  tr.append($("<th>", {text: "Payment #"}));
  tr.append($("<th>", {text: "Default Interest"}));
  tr.append($("<th>", {text: "Default Principle"}));
  tr.append($("<th>", {text: "Default Balance"}));
  tr.append($("<th>", {text: "Actual Interest"}));
  tr.append($("<th>", {text: "Actual Principle"}));
  tr.append($("<th>", {text: "Actual Balance"}));
  tr.append($("<th>", {text: "Money Saved"}));
  thead.append(tr);
  table.append(thead);

  payments.forEach(function(payment, index) {
    var moneySaved = payment.defaultInterestPaid - payment.actualInterestPaid;
    if (moneySaved < 0) {
      moneySaved = '';
    }

    tr = $("<tr>");
    tr.append($("<td>", {text: index + 1}));
    tr.append($("<td>", {text: Number(payment.defaultInterest).toFixed(2)}));
    tr.append($("<td>", {text: Number(payment.defaultPrinciple).toFixed(2)}));
    tr.append($("<td>", {text: Number(payment.defaultBalance).toFixed(2)}));
    tr.append($("<td>", {text: Number(payment.actualInterest).toFixed(2)}));
    tr.append($("<td>", {text: Number(payment.actualPrinciple).toFixed(2)}));
    tr.append($("<td>", {text: Number(payment.actualBalance).toFixed(2)}));
    tr.append($("<td>", {text: Number(moneySaved).toFixed(2)}));
    tbody.append(tr);
  });
  table.append(tbody);
  $("#main").append(table);
  $("#actualPaymentModal").modal("hide");
});

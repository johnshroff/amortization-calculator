function amortization(currentBalance, interestRate, termLength) {
    this.currentBalance = currentBalance,
    this.interestRate = interestRate,
    this.termLength = termLength;
    var monthlyPayment,
    totalSavings,
    actualInterestPaid,
    defaultInterestPaid,
    paymentSchedule = [];

    this.calculateMonthlyPayment = function() {
      var paymentPeriods = this.termLength,
        interestPerPeriod = this.interestRate / 12;
      monthlyPayment = currentBalance * ((interestPerPeriod * Math.pow((1 + interestPerPeriod), paymentPeriods)) / (Math.pow((1 + interestPerPeriod), paymentPeriods) -1));
      return monthlyPayment;
    };
    this.calculatePaymentSchedule = function() {
      var paymentPeriods = this.termLength,
        interestPerPeriod = this.interestRate / 12,
        previousDefaultBalance = this.currentBalance,
        previousActualBalance = this.currentBalance;

      defaultInterestPaid = 0,
      actualInterestPaid = 0;
      paymentSchedule = [];

      for (var i = 1; i < paymentPeriods; i++) {
          var payment = {};

          payment["defaultInterest"] = previousDefaultBalance * interestPerPeriod;
          payment["defaultPrinciple"] = monthlyPayment - payment.defaultInterest;

          previousDefaultBalance -= payment.defaultPrinciple;
          defaultInterestPaid += payment.defaultInterest;

          payment["defaultBalance"] = previousDefaultBalance;
          payment["defaultInterestPaid"] = defaultInterestPaid;

          if (previousActualBalance > 0) {
            payment["actualInterest"] = previousActualBalance * interestPerPeriod;

            if (parseFloat(previousActualBalance) < parseFloat(this.actualMonthlyPayment)) {
                payment["actualPrinciple"] = previousActualBalance;
                previousActualBalance = 0;
            } else {
              payment["actualPrinciple"] = this.actualMonthlyPayment - payment.actualInterest;
              previousActualBalance -= payment["actualPrinciple"];
            }

            actualInterestPaid += payment.actualInterest;

            payment["actualBalance"] = previousActualBalance;
            payment["actualInterestPaid"] = actualInterestPaid;
          } else {
            payment["actualInterest"] = 0;
            payment["actualPrinciple"] = 0;
            payment["actualBalance"] = 0;
            payment["actualInterestPaid"] = actualInterestPaid;
          }

          paymentSchedule.push(payment);
      }

      totalSavings = defaultInterestPaid - actualInterestPaid;
    };
    this.getMonthlyPayment = function() {
      return Number(monthlyPayment).toFixed(2);
    };
    this.getPaymentSchedule = function() {
      if (paymentSchedule.length == 0) {
        this.calculatePaymentSchedule();
      }
      return paymentSchedule;
    };
    this.getTotalSavings = function () {
      return Number(totalSavings).toFixed(2);
    };
    this.getActualInterestPaid = function () {
      return Number(actualInterestPaid).toFixed(2);
    };
    this.getDefaultInterestPaid = function () {
      return Number(defaultInterestPaid).toFixed(2);
    }

    this.calculateMonthlyPayment();
    this.actualMonthlyPayment = monthlyPayment;
    totalSavings = 0;
}

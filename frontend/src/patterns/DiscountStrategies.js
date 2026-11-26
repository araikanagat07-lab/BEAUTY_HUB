class NoDiscount {
  calculate() {
    return 0;
  }
}

class PercentDiscount {
  constructor(percent) {
    this.percent = percent;
  }

  calculate(sum) {
    return Math.round((sum * this.percent) / 100);
  }
}

class FixedDiscount {
  constructor(amount) {
    this.amount = amount;
  }

  calculate(sum) {
    return Math.min(this.amount, sum); // скидка не больше суммы
  }
}


const promoCodes = {
  BEAUTY10: new PercentDiscount(10),
  VIP20: new PercentDiscount(20),
  WELCOME2000: new FixedDiscount(2000),
};

export function getDiscountStrategy(code) {
  return promoCodes[code.trim().toUpperCase()] || new NoDiscount();
}

export function isValidPromo(code) {
  return promoCodes[code.trim().toUpperCase()] !== undefined;
}

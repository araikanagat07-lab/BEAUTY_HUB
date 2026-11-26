export const extras = [
  { id: "design", name: "Дизайн ногтей", description: "Небольшой рисунок или декор", price: 2000, image: "/images/nails1.jpg" },
  { id: "strengthening", name: "Укрепление ногтей", description: "Дополнительное укрепляющее покрытие", price: 1500, image: "/images/nails2.jpg" },
  { id: "removal", name: "Снятие старого покрытия", description: "Аккуратное снятие предыдущего покрытия", price: 1000, image: "/images/nails3.jpg" },
];


class ServiceDecorator {
  constructor(service) {
    this.service = service; 
  }

  getPrice() {
    return this.service.getPrice();
  }

  getDescription() {
    return this.service.getDescription();
  }
}

class NailDesignDecorator extends ServiceDecorator {
  getPrice() {
    return this.service.getPrice() + 2000;
  }

  getDescription() {
    return this.service.getDescription() + " + дизайн";
  }
}

class StrengtheningDecorator extends ServiceDecorator {
  getPrice() {
    return this.service.getPrice() + 1500;
  }

  getDescription() {
    return this.service.getDescription() + " + укрепление";
  }
}

class RemovalDecorator extends ServiceDecorator {
  getPrice() {
    return this.service.getPrice() + 1000;
  }

  getDescription() {
    return this.service.getDescription() + " + снятие";
  }
}

export function decorateService(service, selectedIds) {
  let result = service;
  if (selectedIds.includes("design")) result = new NailDesignDecorator(result);
  if (selectedIds.includes("strengthening")) result = new StrengtheningDecorator(result);
  if (selectedIds.includes("removal")) result = new RemovalDecorator(result);
  return result;
}

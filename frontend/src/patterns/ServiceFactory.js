class BeautyService {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.supportsExtras = false; 
  }

  getPrice() {
    return this.price;
  }

  getDescription() {
    return this.name;
  }
}

class ManicureService extends BeautyService {
  constructor(name, price) {
    super(name, price);
    this.supportsExtras = true; 
  }
}

class MakeupService extends BeautyService {}
class HairService extends BeautyService {}
class BrowService extends BeautyService {}


class ServiceCreator {
  createService(name, price) {
    return new BeautyService(name, price);
  }
}

class ManicureCreator extends ServiceCreator {
  createService(name, price) {
    return new ManicureService(name, price);
  }
}

class MakeupCreator extends ServiceCreator {
  createService(name, price) {
    return new MakeupService(name, price);
  }
}

class HairCreator extends ServiceCreator {
  createService(name, price) {
    return new HairService(name, price);
  }
}

class BrowCreator extends ServiceCreator {
  createService(name, price) {
    return new BrowService(name, price);
  }
}

const creators = {
  Маникюр: new ManicureCreator(),
  Макияж: new MakeupCreator(),
  Укладка: new HairCreator(),
  Брови: new BrowCreator(),
};


export function createService(category, name, price) {
  const creator = creators[category] || new ServiceCreator();
  const service = creator.createService(name, price);
  return service;
}

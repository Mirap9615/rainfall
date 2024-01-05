let correlator = {
    "basic_broadsword": ["broadsword", 1, false],
    "iron_broadsword": ["iron broadsword", 1, false],
    "dirt": ["dirt", 2, true]
};

let organisms = {
    "cow": ["cow", 70, false],
    "human": ["human", 100, false]
};

let swords = {
    "basic_broadsword": [10, 50, 1.7],
    "iron_broadsword": [15, 200, 1.8]
};

class Organism {
    constructor(internal_name){
        [this.displayname, this.hp, this.magic_capable] = organisms[internal_name];
        this.holding = null
    }
}

class Human extends Organism {
    constructor(actual_name, internal_name) {
        super(internal_name);
        this.actualname = actual_name;
    }
}

class Item {
    static nextUniqueId = 1;

    constructor(internal_name) {
        [this.displayname, this.type, this.stackable] = correlator[internal_name];
        this._uniqueId = Item.nextUniqueId++;
    }

    get uniqueId() {
        return this._uniqueId;
    }
}

class Sword extends Item {
    constructor(internal_name) {
        super(internal_name);
        [this.damage, this.durability, this.range] = swords[internal_name];
        this.broken = false
        this.heldby = null
    }

    swing() {
        console.log(`The sword ${this.displayname} swung.`);
    }

    calculate_damage() {
        return this.damage;
    }

    equip(target) {
        if (this.broken) {
            return
        }
        if (target instanceof Organism) {
            this.heldby = target
            target.holding = this
        }
    }

    checkbroken() {
        if (this.durability <= 0 && !this.broken) {
            this.broken = true
            console.log(`Ouch! The sword ${this.displayname} broke!`)
            if (!(this.heldby == null)) {
                this.heldby.holding = null
                this.heldby = null
            }
        }
    }
    hit_target(target) {
        if (this.broken) {
            return
        }
        this.durability--;
        let damage = this.calculate_damage();
        if (target instanceof Organism) {
            console.log(`The sword ${this.displayname} hit ${target.actualname || target.displayname} for ${damage} damage!`);
            target.hp -= damage;
        } else {
            console.log(`The sword ${this.displayname} hit ${target.displayname} for ${damage} damage!`);
        }
        this.checkbroken();
    }
}

let cow = new Organism("cow")
let john = new Human("John", "human");

let starter_sword = new Sword("basic_broadsword");
starter_sword.swing();
starter_sword.hit_target(john);
starter_sword.hit_target(cow);

for (let i = 0; i < 50; i++) {
    starter_sword.hit_target(john);
}

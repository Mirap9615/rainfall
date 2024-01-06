let correlator = {
    "basic_broadsword": ["broadsword", 1, false],
    "iron_broadsword": ["iron broadsword", 1, false],
    "dirt": ["dirt", 2, true]
};

let organisms = {
    "cow": ["cow", 70, false],
    "human": ["human", 100, true]
};

let swords = {
    "basic_broadsword": [10, 50, 1.7],
    "iron_broadsword": [15, 200, 1.8]
};

class Organism {
    constructor(internal_name){
        [this.displayname, this.hp, this.magic_capable] = organisms[internal_name];
        this.holding = null
        this.alive = true
    }

    report_equipment() {
        console.log(`${this.displayname} is holding a ${this.holding.displayname}`)
    }

    equip(item) {
        if (this.alive) {
            if (item instanceof Item) {
                item.heldby = this
                this.holding = item
            }
        }

    }

    death_sequence() {
        // make sure it is only done once
        if (this.alive === false) {
            return
        }
        console.log(`${this.displayname} was killed!`)
        this.alive = false
    }

    unequip(item){
        if (this.alive) {
            if (item instanceof Item && item.heldby === this) {
                item.heldby = null
                this.holding = null
            }
        }
    }

    take_damage(damage) {
        // return if the organism took damage successfully
        if (this.alive && this.hp > 0) {
            this.hp -= damage
            if (this.hp <= 0) {
                this.death_sequence();
            }
            return true
        }
        return false

    }
}

class Human extends Organism {
    constructor(actual_name, internal_name) {
        super(internal_name);
        this.actualname = actual_name;
    }

    death_sequence()  {
        // make sure it is only done once
        if (this.alive === false) {
            return
        }
        console.log(`${this.actualname} died!`)
        this.alive = false
    }
}

class Item {
    static nextUniqueId = 1;

    constructor(internal_name) {
        [this.displayname, this.type, this.stackable] = correlator[internal_name];
        this._uniqueId = Item.nextUniqueId++;
        this.broken = false
        this.heldby = null
    }

    get uniqueId() {
        return this._uniqueId;
    }
}

class Sword extends Item {
    constructor(internal_name) {
        super(internal_name);
        [this.damage, this.durability, this.range] = swords[internal_name];

    }

    swing() {
        console.log(`The sword ${this.displayname} swung.`);
    }

    calculate_damage() {
        return this.damage;
    }

    get_equipped_by(target) {
        target.equip(this)
    }

    get_unequipped_by(target) {
        target.unequip(this)
    }

    check_broken() {
        if (this.durability <= 0 && !this.broken) {
            this.broken = true
            console.log(`Oh no! The sword ${this.displayname} broke!`)
            if (!(this.heldby === null)) {
                this.get_unequipped_by(this.heldby)
            }
        }
    }

    hit_target(target) {
        if (this.broken) {
            console.log("You cannot attack with a broken weapon!")
            return
        }
        if (target.alive === false) {
            console.log("You cannot attack a dead target!")
            return
        }

        this.durability--;
        let damage = this.calculate_damage();
        if (target instanceof Organism) {
            console.log(`The sword ${this.displayname} hit ${target.actualname || target.displayname} for ${damage} damage!`);
        } else {
            console.log(`The sword ${this.displayname} hit ${target.displayname} for ${damage} damage!`);
        }
        target.take_damage(damage);
        this.check_broken();
    }
}

let cow = new Organism("cow")
let john = new Human("John", "human");
let serah = new Human("Serah", "human");

let starter_sword = new Sword("basic_broadsword");
starter_sword.swing();
starter_sword.hit_target(john);
starter_sword.hit_target(cow);

for (let i = 0; i < 50; i++) {
    starter_sword.hit_target(john);
}

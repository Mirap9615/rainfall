let correlator = {
    "basic_broadsword": ["broadsword", 1, false],
    "iron_broadsword": ["iron broadsword", 1, false],
    "diamond_broadsword": ["diamond broadsword", 1, false],
    "priestess_staff": ["priestess staff", 1, false],
    "dirt": ["dirt", 2, true]
};

let organisms = {
    // display name, health, magic_capable, defense, base_attack, base_counterattack_chance
    "cow": ["cow", 70, false, 1, 0.5, 0],
    "human": ["human", 100, true, 2, 4, 0],
    "demon": ["demon", 500, true, 5, 10, 5],
    "priestess": ["priestess", 2000, true, 30, 30, 15]
};

let swords = {
    "basic_broadsword": [10, 50, 1.7],
    "iron_broadsword": [15, 200, 1.8],
    "diamond_broadsword": [30, 1000, 2],
    "priestess_staff": [50, 10000, 2.2]
};

class Organism {
    constructor(internal_name){
        [this.displayname, this.hp, this.magic_capable, this.defense, this.atk, this.counter_chance] = organisms[internal_name];
        this.holding = null
        this.alive = true
        this.actualname = this.displayname
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

    calculate_effective_damage(target) {
        if (this.holding) {
            return (this.holding.calculate_damage() + this.atk) - target.defense
        } else {
            return (this.atk - target.defense)
        }
    }

    take_damage(already_effective_damage, attacker) {
        // return if the organism took damage successfully
        if (this.alive && this.hp > 0) {
            this.hp -= already_effective_damage
            if (this.hp <= 0) {
                this.death_sequence();
            } else {
                this.attempt_counter_attack(attacker);
            }
            return true
        }
        return false
    }

    attempt_counter_attack(attacker) {
        let counterAttackChance = Math.random() * 100;
        if (counterAttackChance <= this.counter_chance) {
            console.log(`${this.actualname} counter attacked ${attacker.actualname}!`);
            this.attack(attacker)
        }
    }


    attack(target) {
        if (!(target instanceof Organism) || !this.alive || !target.alive) {
            return;
        }

        let damage;

        if (this.holding instanceof Sword) {
            this.holding.durability--;
            damage = this.calculate_effective_damage(target);
            console.log(`${this.actualname} hit ${target.actualname} with a ${this.holding.displayname} for ${damage} damage!`);
            this.holding.check_broken();
        } else {
            // Calculate damage based on raw attack power if not holding a weapon
            damage = this.calculate_effective_damage(this.atk, target);
            console.log(`${this.actualname} smacked ${target.actualname} with their fists!`);

        }
        target.take_damage(damage, this);
    }

}

class Human extends Organism {
    constructor(actual_name, internal_name) {
        super(internal_name);
        this.actualname = actual_name
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
        console.log(`The ${this.displayname} swung.`);
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
            console.log(`Oh no! The ${this.displayname} broke!`)
            if (!(this.heldby === null)) {
                this.get_unequipped_by(this.heldby)
            }
        }
    }
}


let cow = new Organism("cow")
let john = new Human("John", "demon");
let serah = new Human("Serah", "human");
let miko = new Human("Miko", "priestess");

let starter_sword = new Sword("diamond_broadsword");
let defending_sword = new Sword("priestess_staff");
serah.equip(starter_sword)
miko.equip(defending_sword)
serah.attack(john)

for (let i = 0; i < 500; i++) {
    serah.attack(miko);
}

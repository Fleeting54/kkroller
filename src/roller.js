const validations = require("./validations")
const names = ["kris", "allisha", "andrew", "chelsea", "nick", "alex"]
const namesMaster = ["kris", "allisha", "andrew", "chelsea", "nick", "alex"]

class Roller{
    constructor(){

    }

    rollNames(){
        namesMaster.forEach((name,index)=>{
            console.log("****************************************")
            console.log("Processing:", name)
            console.log("****************************************")
            let arrCopy = names.filter( val => val.toString() !== name)
            console.log(`Starting pool for ${name}`)
            console.log(arrCopy)
            let exceptions = validations.get(name)
            exceptions.forEach((e,i)=>{
                if(arrCopy.indexOf(e) !== -1) {
                    console.log(`found exception: ${e} at index ${arrCopy.indexOf(e)}`)
                    console.log(`removing exception: ${arrCopy.splice(arrCopy.indexOf(e), 1)} from pool`)
                }else {
                    console.log("no exceptions left in pool")
                }
            })

            console.log("final pool for",name)
            console.log(arrCopy)
            let min = Math.ceil(0);
            let max = Math.floor(arrCopy.length);
            let roll = Math.floor(Math.random() * (max - min) + min)
            console.log(`${name} rolled a ${roll}`); //The maximum is exclusive and the minimum is inclusive
            console.log(`${name}'s KK is ${arrCopy[roll]}`)
            //remove the persons name from the next set of roles
            //find index of persons name in name array
            names.splice(names.findIndex(i => i === arrCopy[roll]),1)
        })
    }

}

module.exports = Roller



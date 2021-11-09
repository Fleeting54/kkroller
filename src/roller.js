const validations = require("./validations")
const mailConstants = require("./mail/mailConstants")
const mailer = require("./mail/mailer")
const fs = require("fs")
const ejs = require("ejs")



// const names = ["kris", "allisha", "andrew", "chelsea", "nick", "alex", "hudson"]
// const namesMaster = ["kris", "allisha", "andrew", "chelsea", "nick", "alex", "hudson"]

class Roller {
    constructor() {
        this.names = []
        validations.forEach((value, key)=>{
            this.names.push(key)
        })
        this.namesMaster = []
        validations.forEach((value, key)=>{
            this.namesMaster.push(key)
        })
        this.results = new Map();

    }

    rollNames() {
        try {
            this.namesMaster.forEach((name, index) => {
                console.log("****************************************")
                console.log("Processing:", name)
                console.log("****************************************")
                let arrCopy = this.names.filter(val => val.toString() !== name)
                console.log(`Starting pool for ${name}`)
                console.log(arrCopy)
                let exceptions = validations.get(name)
                exceptions.forEach((e, i) => {
                    if (arrCopy.indexOf(e) !== -1) {
                        console.log(`found exception: ${e} at index ${arrCopy.indexOf(e)}`)
                        console.log(`removing exception: ${arrCopy.splice(arrCopy.indexOf(e), 1)} from pool`)
                    } else {
                        console.log("no exceptions left in pool")
                    }
                })

                console.log("final pool for", name)
                console.log(arrCopy)
                let min = Math.ceil(0);
                let max = Math.floor(arrCopy.length);
                let roll = Math.floor(Math.random() * (max - min) + min)
                if (arrCopy[roll] === undefined) {
                    let e = new Error;
                    e.name = "False Roll"
                    e.message = `${name} has no eligible partners in pool: ${arrCopy}`
                    throw e;
                }
                console.log(`${name} rolled a ${roll}`); //The maximum is exclusive and the minimum is inclusive
                console.log(`${name}'s KK is ${arrCopy[roll]}`)
                //remove the persons name from the next set of rolls
                //find index of persons name in name array
                this.names.splice(this.names.findIndex(i => i === arrCopy[roll]), 1)

                this.results.set(name, arrCopy[roll])
            })
            //this.printResults()

            let i=0
            const iterator = this.results.entries();
                let interval = setInterval(()=>{
                    if(i<this.results.size) {
                        let pair = iterator.next().value
                        this.mailResult(pair[0], pair[1])
                        i++
                    } else {
                        clearInterval(interval)
                    }
                },2000)

        } catch (e) {
            console.log(e.name)
            console.log(e.message)
        }
    }

    printResults() {
        console.log(this.results)
    }

    mailResult(sender, receiver) {
        const mailTemplate = fs.readFileSync("./src/mail/template.html").toString();
        const mailVars = {name: sender[0].toUpperCase() + sender.slice(1), partner: receiver[0].toUpperCase() + receiver.slice(1)}
        const html = ejs.render(mailTemplate,mailVars)
            let mailOptions = {
                from: mailConstants.sender,
                to: mailConstants.mailMap.get(sender),
                subject: 'Your KK is ...',
                html: html,
                text: `hi ${sender}, \n Your 2021 KK partner is ${receiver}`
            };
           return mailer.sendMail(mailOptions, (err,info)=>{
               if (err){
                   console.log(err)
               } else {
                   console.log("message sent")
               }
           })
    }
}

module.exports = Roller



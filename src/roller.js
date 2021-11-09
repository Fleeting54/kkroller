const validations = require("./validations")
const mailConstants = require("./mail/mailConstants")
const mailer = require("./mail/mailer")
const fs = require("fs")
const ejs = require("ejs")
const logger = require("./logger/logger")

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
                logger.debug("****************************************")
                logger.debug(`Processing: ${name}`)
                logger.debug("****************************************")
                let arrCopy = this.names.filter(val => val.toString() !== name)
                logger.debug(`Starting pool for ${name}`)
                logger.debug(arrCopy)
                let exceptions = validations.get(name)
                exceptions.forEach((e, i) => {
                    if (arrCopy.indexOf(e) !== -1) {
                        logger.debug(`found exception: ${e} at index ${arrCopy.indexOf(e)}`)
                        logger.debug(`removing exception: ${arrCopy.splice(arrCopy.indexOf(e), 1)} from pool`)
                    } else {
                        logger.debug("no exceptions left in pool")
                    }
                })

                logger.debug(`final pool for ${name}`)
                logger.debug(arrCopy)
                let min = Math.ceil(0);
                let max = Math.floor(arrCopy.length);
                let roll = Math.floor(Math.random() * (max - min) + min)
                if (arrCopy[roll] === undefined) {
                    let e = new Error;
                    e.name = "False Roll"
                    e.message = `${name} has no eligible partners in pool: ${arrCopy}`
                    throw e;
                }
                logger.debug(`${name} rolled a ${roll}`); //The maximum is exclusive and the minimum is inclusive
                logger.debug(`${name}'s KK is ${arrCopy[roll]}`)
                //remove the persons name from the next set of rolls
                //find index of persons name in name array
                this.names.splice(this.names.findIndex(i => i === arrCopy[roll]), 1)

                this.results.set(name, arrCopy[roll])
            })
            this.printResults()

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
                },5000) //upped timer to avoid concurrent connections

        } catch (e) {
            logger.error(e.name)
            logger.error(e.message)
        }
    }

    printResults() {
        logger.result("the draw results are:")
        this.results.forEach((value, key)=>{
            logger.result(`${key} => ${value}`)
        })
        logger.result("************************")
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
                   logger.error(err)
               } else {
                   logger.info("message sent")
               }
           })
    }
}

module.exports = Roller



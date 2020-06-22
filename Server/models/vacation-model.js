class Vacation {
    constructor(vacationId, description, destination, vacationImg, vacationDates, price, numberOfFollowers) {
        this.vacationId = vacationId;
        this.description = description;
        this.destination = destination;
        this.vacationImg = vacationImg;
        this.vacationDates = vacationDates;
        this.price = price;
        this.numberOfFollowers = numberOfFollowers;
    }
}

module.exports = Vacation;
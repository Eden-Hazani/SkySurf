class Vacation {
    constructor(vacationId, description, destination, startDate, endDate, vacationImg, price, numberOfFollowers) {
        this.vacationId = vacationId;
        this.description = description;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate
        this.vacationImg = vacationImg;
        this.price = price;
        this.numberOfFollowers = numberOfFollowers;
    }
}

module.exports = Vacation;
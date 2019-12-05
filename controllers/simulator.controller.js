const Simulator = require('../simulator/');
const sim = new Simulator();

sim.start();

const getWind = (req, res) => {
    res.send(sim.getWind().toString());
    return;
};

const getHouseholdConsumption = (req, res) => {
    let household = sim.getHouseholds().find(h => h.username === req.session.user.username);
    res.send(household.getConsumption().toString());
    return;
};

const getElectricityPrice = (req, res) => {
    res.send(sim.getElectricityPrice().toString());
    return;
};

module.exports = {
    getWind,
    getHouseholdConsumption,
    getElectricityPrice,
    sim
}
export function calculateEnergyBurden(userData, stateData, stateAverageEB) {
    // Zc = Zipcode
    // Ee = annual household electricity con-sumption (kWh)
    // Eh = annual heating (therm/BTU) 
    // Mi = median household income
  const { Zc, Ee, Eh, Mi } = userData;
  const rates = stateData[Zc];

  if (!rates) {
    return {
      energyBurdenPercent: null,
      message: "No rate data for this zip code.",
      display: null
    }
  }
// Re = electricity rate ($/kWh)
// Rh = heating rate ($/therm)
  const { Re, Rh } = rates;

  const E_price = Ee * Re;
  const H_price = Eh * Rh;
  const T_price = E_price + H_price;
  const EB = (T_price / Mi) * 100;

  let message, display = null;

  if (EB > stateAverageEB) {
    message = "Overburdened";
    display = "[Tips to lower energy burden](#)";
  } else {
    message = "Below State Average";
  }

  return {
    energyBurdenPercent: EB.toFixed(2) + "%",
    message,
    display
  }
}
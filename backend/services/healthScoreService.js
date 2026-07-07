/**
 * Calculates health score.
 * Formula: 100 - cpu%*0.3 - mem%*0.25 - disk%*0.2 - net%*0.15 - responsePenalty*0.1
 * @param {Object} metrics - { cpu, memory, disk, networkUp, networkDown, responseTime }
 * @returns {number} Health score (0-100)
 */
const calculateHealthScore = (metrics) => {
  const { cpu, memory, disk, networkUp, networkDown, responseTime } = metrics;
  
  // Normalize network usage to a percentage for the formula (assuming some max capacity, say 1000MB/s)
  const networkUsage = Math.min(((networkUp + networkDown) / 1000) * 100, 100);
  
  // Response time penalty (e.g. max penalty if response > 1000ms)
  const responsePenalty = Math.min((responseTime / 1000) * 100, 100);

  let score = 100 
    - (cpu * 0.3)
    - (memory * 0.25)
    - (disk * 0.2)
    - (networkUsage * 0.15)
    - (responsePenalty * 0.1);

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Classifies the health status based on the score.
 * @param {number} score 
 * @returns {'Excellent' | 'Healthy' | 'Warning' | 'Critical'}
 */
const getHealthStatus = (score) => {
  if (score >= 90) return 'Excellent'; // The spec said 90-100 Excellent
  if (score >= 70) return 'Healthy';   // The spec said 70-89 Healthy
  if (score >= 40) return 'Warning';   // The spec said 40-69 Warning
  return 'Critical';                   // The spec said <40 Critical
};

module.exports = {
  calculateHealthScore,
  getHealthStatus
};

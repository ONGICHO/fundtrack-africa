const anomalies = {};

class AnomalyController {
  static async getAllAnomalies(req, res) {
    try {
      const { status, severity, page = 1, limit = 20 } = req.query;
      
      let anomaliesList = Object.values(anomalies);

      if (status) anomaliesList = anomaliesList.filter(a => a.status === status);
      if (severity) anomaliesList = anomaliesList.filter(a => a.severity === severity);

      const startIndex = (page - 1) * limit;
      const paginatedAnomalies = anomaliesList.slice(startIndex, startIndex + parseInt(limit));

      res.json({
        success: true,
        data: paginatedAnomalies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: anomaliesList.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ANOMALIES_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getAnomalyById(req, res) {
    try {
      const { id } = req.params;
      const anomaly = anomalies[id];

      if (!anomaly) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Anomaly not found'
          }
        });
      }

      res.json({
        success: true,
        data: anomaly
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ANOMALY_ERROR',
          message: error.message
        }
      });
    }
  }

  static async triggerAnomalyScan(req, res) {
    try {
      const { fund_id, days_to_scan = 30 } = req.body;

      const scan = {
        scan_id: Math.random().toString(36).substr(2, 9),
        fund_id,
        days_to_scan,
        status: 'in_progress',
        started_at: new Date(),
        message: 'Anomaly scan initiated. Results will be available shortly.'
      };

      res.json({
        success: true,
        data: scan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SCAN_ERROR',
          message: error.message
        }
      });
    }
  }

  static async reviewAnomaly(req, res) {
    try {
      const { id } = req.params;
      const { status, comment } = req.body;
      const anomaly = anomalies[id];

      if (!anomaly) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Anomaly not found'
          }
        });
      }

      anomaly.status = status;
      anomaly.reviewed_by = req.user.id;
      anomaly.review_comment = comment;
      anomaly.reviewed_at = new Date();
      anomaly.updated_at = new Date();

      anomalies[id] = anomaly;

      res.json({
        success: true,
        message: 'Anomaly reviewed successfully',
        data: anomaly
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'REVIEW_ANOMALY_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getAnomalyTrends(req, res) {
    try {
      const trends = {
        total_detected: 45,
        critical: 5,
        high: 12,
        medium: 18,
        low: 10,
        confirmed: 25,
        pending_review: 15,
        false_positive: 5,
        trend_by_severity: [
          { severity: 'critical', count: 5, percentage: 11.1 },
          { severity: 'high', count: 12, percentage: 26.7 },
          { severity: 'medium', count: 18, percentage: 40 },
          { severity: 'low', count: 10, percentage: 22.2 }
        ]
      };

      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'ANOMALY_TRENDS_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = AnomalyController;

const resources = {};
const resourceLocations = {};

class ResourceController {
  static async getAllResources(req, res) {
    try {
      const { type, page = 1, limit = 20 } = req.query;
      
      let resourcesList = Object.values(resources);

      if (type) {
        resourcesList = resourcesList.filter(r => r.type === type);
      }

      const startIndex = (page - 1) * limit;
      const paginatedResources = resourcesList.slice(startIndex, startIndex + parseInt(limit));

      res.json({
        success: true,
        data: paginatedResources,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: resourcesList.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_RESOURCES_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getResourceById(req, res) {
    try {
      const { id } = req.params;
      const resource = resources[id];

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      res.json({
        success: true,
        data: resource
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_RESOURCE_ERROR',
          message: error.message
        }
      });
    }
  }

  static async createResource(req, res) {
    try {
      const { name, type, description, unit_of_measure, total_quantity } = req.body;

      if (!name || !type) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name and type are required'
          }
        });
      }

      const resource = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type,
        description,
        unit_of_measure,
        total_quantity: parseFloat(total_quantity) || 0,
        allocated_quantity: 0,
        remaining_quantity: parseFloat(total_quantity) || 0,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      resources[resource.id] = resource;

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: resource
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_RESOURCE_ERROR',
          message: error.message
        }
      });
    }
  }

  static async updateResource(req, res) {
    try {
      const { id } = req.params;
      const resource = resources[id];

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      Object.assign(resource, req.body, { updated_at: new Date() });
      resources[id] = resource;

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: resource
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_RESOURCE_ERROR',
          message: error.message
        }
      });
    }
  }

  static async getResourceLocations(req, res) {
    try {
      const { id } = req.params;
      const resource = resources[id];

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      const locations = Object.values(resourceLocations).filter(l => l.resource_id === id);

      res.json({
        success: true,
        data: locations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LOCATIONS_ERROR',
          message: error.message
        }
      });
    }
  }

  static async updateResourceLocation(req, res) {
    try {
      const { id } = req.params;
      const { state_id, department_id, quantity, latitude, longitude, address, warehouse_name } = req.body;

      const resource = resources[id];
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      const location = {
        id: Math.random().toString(36).substr(2, 9),
        resource_id: id,
        state_id,
        department_id,
        quantity: parseFloat(quantity),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        warehouse_name,
        last_updated: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      };

      resourceLocations[location.id] = location;

      res.status(201).json({
        success: true,
        message: 'Resource location updated successfully',
        data: location
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_LOCATION_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = ResourceController;

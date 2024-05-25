const router = require("express").Router();
const Role = require("../models/Role"); // Assuming you have a Role model

// GET all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a role by ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json(err);
  }
});
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API endpoints for managing roles
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieves all roles.
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     description: Retrieves a role by its ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Internal server error
 */

module.exports = router;

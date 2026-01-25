import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Customer from './Customer.js';

const Query = sequelize.define('Query', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'id'
        }
    },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    response: { type: DataTypes.TEXT },
    query_status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        defaultValue: 'Open'
    }
}, {
    tableName: 'queries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Query.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Query, { foreignKey: 'customer_id' });

export default Query;

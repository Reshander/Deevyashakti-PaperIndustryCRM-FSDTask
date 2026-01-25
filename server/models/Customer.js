import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Customer;

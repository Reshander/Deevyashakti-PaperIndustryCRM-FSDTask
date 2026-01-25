import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Customer from './Customer.js';

const PurchaseOrder = sequelize.define('PurchaseOrder', {
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
    company_name: { type: DataTypes.STRING, allowNull: false },
    company_address: { type: DataTypes.TEXT },
    delivery_address: { type: DataTypes.TEXT },
    product: {
        type: DataTypes.ENUM('DIVPAK', 'DIVLITE', 'DIVGLO'),
        allowNull: false
    },
    gsm: { type: DataTypes.INTEGER, allowNull: false },
    size_a: { type: DataTypes.DECIMAL(10, 2) },
    size_b: { type: DataTypes.DECIMAL(10, 2) },
    packing_type: {
        type: DataTypes.ENUM('Bundle', 'Reel'),
        allowNull: false
    },
    po_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    po_date: { type: DataTypes.DATEONLY, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    po_document_url: { type: DataTypes.STRING }
}, {
    tableName: 'purchase_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

PurchaseOrder.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(PurchaseOrder, { foreignKey: 'customer_id' });

export default PurchaseOrder;

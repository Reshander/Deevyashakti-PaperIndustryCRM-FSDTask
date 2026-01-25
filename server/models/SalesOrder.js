import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import PurchaseOrder from './PurchaseOrder.js';

const SalesOrder = sequelize.define('SalesOrder', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    so_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    po_number: {
        type: DataTypes.STRING,
        references: {
            model: PurchaseOrder,
            key: 'po_number'
        }
    },
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
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    so_status: {
        type: DataTypes.ENUM('Draft', 'Verified', 'Documents Sent', 'Invoiced', 'Cancelled'),
        defaultValue: 'Draft'
    },
    verification_status: {
        type: DataTypes.ENUM('Pending', 'Matched', 'Mismatched'),
        defaultValue: 'Pending'
    },
    verification_remarks: { type: DataTypes.TEXT }
}, {
    tableName: 'sales_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

SalesOrder.belongsTo(PurchaseOrder, { foreignKey: 'po_number', targetKey: 'po_number' });
PurchaseOrder.hasMany(SalesOrder, { foreignKey: 'po_number', sourceKey: 'po_number' });

export default SalesOrder;

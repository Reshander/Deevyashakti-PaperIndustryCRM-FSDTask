import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import SalesOrder from './SalesOrder.js';

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    so_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SalesOrder,
            key: 'id'
        }
    },
    invoice_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    invoice_date: { type: DataTypes.DATEONLY, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    amount_paid: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('Generated', 'Sent', 'Paid'),
        defaultValue: 'Generated'
    },
    payment_status: {
        type: DataTypes.ENUM('Pending', 'Partial', 'Paid'),
        defaultValue: 'Pending'
    },
    payment_remarks: { type: DataTypes.TEXT },
    due_date: { type: DataTypes.DATEONLY },
    last_follow_up_date: { type: DataTypes.DATEONLY }
}, {
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Invoice.belongsTo(SalesOrder, { foreignKey: 'so_id' });
SalesOrder.hasOne(Invoice, { foreignKey: 'so_id' });

export default Invoice;

'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends sequelize_1.Model {
    }
    User.init({
        awsCognitoId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        monto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        proposito: {
            type: DataTypes.STRING,
            defaultValue: "Insertar Proposito:"
        },
        meta: {
            type: DataTypes.INTEGER,
            defaultValue: '0'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};

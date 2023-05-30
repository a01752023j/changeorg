'use strict';

import {Model} from 'sequelize';

interface UserAttributes{
  awsCognitoId: string;
  name: string;
  monto: Number;
  proposito: string;
  meta: Number;
  email: string;
}

module.exports = (sequelize:any, DataTypes:any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    awsCognitoId!: string;
    name!: string;
    monto!: Number;
    proposito!: string;
    meta!: Number;
    email!: string;
  }
  User.init({
    awsCognitoId:{
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:true
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false      
    },
    monto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    proposito:{
      type: DataTypes.STRING,
      defaultValue: "Insertar Proposito:"
    },
    meta:{
      type: DataTypes.INTEGER,
      defaultValue: '0'
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};